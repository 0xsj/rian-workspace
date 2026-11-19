import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsc = path.join(root, 'node_modules/typescript/bin/tsc');
const json = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const exists = async (file) => fs.access(file).then(() => true, () => false);
const quote = (value) => "'" + value.replaceAll("'", "'\\''") + "'";
const digest = (value) => createHash('sha256').update(value).digest('hex');

export function within(base, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative))
    throw Error('Expected a relative file path.');
  const result = path.resolve(base, relative);
  if (!result.startsWith(base + path.sep)) throw Error(`Path leaves its directory: ${relative}`);
  return result;
}

export async function catalog() { return json(path.join(root, 'workspace.json')); }

export async function exercise(input = '.') {
  const target = await fs.realpath(path.resolve(process.cwd(), input));
  const relative = path.relative(root, target).split(path.sep).join('/');
  const index = await catalog();
  if (!index.exercises.some((row) => row.path === relative))
    throw Error('Choose an exercise directory from npm run list.');
  const meta = await json(path.join(target, 'exercise.json'));
  if (meta.path !== relative) throw Error('Exercise identity does not match its directory.');
  return { dir: target, meta };
}

export async function execute(command, cwd, { input = '', timeout = 120_000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command[0], command.slice(1), {
      cwd,
      detached: process.platform !== 'win32',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        PATH: path.join(root, 'node_modules/.bin') + path.delimiter + process.env.PATH,
        npm_config_offline: 'true'
      }
    });
    let stdout = '', stderr = '', timedOut = false, overflow = false, killTimer;
    function kill(signal) {
      try {
        if (process.platform !== 'win32') process.kill(-child.pid, signal);
        else child.kill(signal);
      } catch (error) { if (error.code !== 'ESRCH') throw error; }
    }
    function stop() {
      kill('SIGTERM');
      killTimer ??= setTimeout(() => kill('SIGKILL'), 250);
    }
    const timer = setTimeout(() => { timedOut = true; stop(); }, timeout);
    const append = (stream) => (value) => {
      if (stream === 'stdout') stdout += value;
      else stderr += value;
      if (stdout.length + stderr.length > 1024 * 1024) { overflow = true; stop(); }
    };
    child.stdout.setEncoding('utf8').on('data', append('stdout'));
    child.stderr.setEncoding('utf8').on('data', append('stderr'));
    child.stdin.on('error', (error) => { if (error.code !== 'EPIPE') reject(error); });
    child.on('error', (error) => {
      clearTimeout(timer); clearTimeout(killTimer);
      reject(Error(`Could not start ${command[0]}: ${error.message}. See docs/SETUP.md.`));
    });
    child.on('close', (code, signal) => {
      clearTimeout(timer); clearTimeout(killTimer);
      resolve({ stdout, stderr, code, signal, timedOut, overflow });
    });
    child.stdin.end(input);
  });
}

function okay(result) {
  return result.code === 0 && !result.signal && !result.timedOut && !result.overflow;
}
function show(result) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.timedOut) console.error('Stopped: execution time limit exceeded.');
  else if (result.overflow) console.error('Stopped: output exceeded 1 MiB.');
  else if (result.signal) console.error(`Stopped by ${result.signal}.`);
}
function args(command) {
  return command.map((part) => part === '$NODE' ? process.execPath : part === '$TSC' ? tsc :
    part === '$CXX' ? (process.env.CXX || 'c++') : part);
}
async function requireTypescript(meta) {
  if (meta.language === 'typescript' && !await exists(tsc))
    throw Error('Run npm ci from the workspace root first.');
}
async function shell(command, dir) {
  // Resolve the pinned workspace compiler even when preparation runs in a temp dir.
  command = command.replace(/\bnpx tsc\b/g, `${quote(process.execPath)} ${quote(tsc)}`);
  return execute(['/bin/sh', '-c', command], dir);
}
async function sample(dir) { return fs.readFile(path.join(dir, 'sample.stdin'), 'utf8'); }

async function compiled({ dir, meta }) {
  await requireTypescript(meta);
  await fs.mkdir(path.join(dir, '.workspace-build'), { recursive: true });
  const result = await execute(args(meta.build), dir);
  if (!okay(result)) {
    show(result); console.error('BUILD FAILED — the program was not run.');
    return false;
  }
  return true;
}

export async function codingRun(item, check = false) {
  if (!await compiled(item)) return 1;
  const result = await execute(args(item.meta.run), item.dir, { input: await sample(item.dir), timeout: 30_000 });
  show(result);
  if (!okay(result)) { console.error('RUN FAILED.'); return 1; }
  if (!check) { console.log('\nRun finished with exit code 0. Use check to compare the public sample.'); return 0; }
  const expected = await fs.readFile(path.join(item.dir, 'sample.stdout'), 'utf8');
  if (result.stdout !== expected || result.stderr !== '') {
    console.error('SAMPLE MISMATCH');
    console.error('Expected stdout:', JSON.stringify(expected));
    console.error('Actual stdout:  ', JSON.stringify(result.stdout));
    if (result.stderr) console.error('Expected stderr: ""');
    return 1;
  }
  console.log('PUBLIC SAMPLE PASSED — this does not award website acceptance.');
  return 0;
}

async function artifact(dir, file) {
  try {
    const target = within(dir, file);
    const [contents, stat] = await Promise.all([fs.readFile(target), fs.stat(target)]);
    return { hash: digest(contents), mtime: stat.mtimeMs, size: stat.size };
  } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

export async function taskRun({ dir, meta }, label) {
  await requireTypescript(meta);
  const config = await json(path.join(dir, 'tasks.json'));
  const task = config.tasks?.find((row) => row.label === label);
  if (!task || typeof task.command !== 'string') throw Error(`No saved task named ${label}.`);
  const before = Object.fromEntries(await Promise.all(meta.artifacts.map(async (p) => [p, await artifact(dir, p)])));
  const sourceHash = digest(await fs.readFile(within(dir, meta.source)));
  console.log(`Task: ${label}\n$ ${task.command}`);
  const result = await shell(task.command, dir);
  show(result);
  const originsFile = path.join(dir, '.workspace-state/artifacts.json');
  let origins = {};
  try { origins = await json(originsFile); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const outputs = {};
  for (const file of meta.artifacts) {
    const after = await artifact(dir, file);
    const refreshed = !!after && (!before[file] || before[file].mtime !== after.mtime || before[file].hash !== after.hash);
    if (after && refreshed && okay(result)) origins[file] = { artifactHash: after.hash, sourceHash };
    const matchesSavedSource = !!after && origins[file]?.artifactHash === after.hash && origins[file]?.sourceHash === sourceHash;
    outputs[file] = { ...after, refreshed, matchesSavedSource };
    if (after) console.log(`${file}: ${refreshed ? 'refreshed' : 'retained'} (${after.hash.slice(0, 12)}), ${matchesSavedSource ? 'matches recorded source' : 'source connection not established'}`);
  }
  const receipt = { task: label, command: task.command, sourceHash, success: okay(result), outputs };
  await fs.mkdir(path.join(dir, '.workspace-state'), { recursive: true });
  await fs.writeFile(originsFile, JSON.stringify(origins, null, 2) + '\n');
  await fs.writeFile(path.join(dir, '.workspace-state/last-task.json'), JSON.stringify(receipt, null, 2) + '\n');
  console.log(okay(result) ? 'Task exited 0. Inspect the artifact and sample separately.' : 'TASK FAILED. Older artifacts may still exist.');
  return { result, receipt };
}

export async function launchRun(item, name) {
  const { dir, meta } = item;
  let file = meta.artifacts[0];
  if (name) {
    const config = await json(path.join(dir, 'launch.json'));
    const launch = config.configurations?.find((row) => row.name === name);
    if (!launch || !meta.artifacts.includes(launch.program) || typeof launch.preLaunchTask !== 'string')
      throw Error('Launch must name a supported artifact and an existing preLaunchTask.');
    const task = await taskRun(item, launch.preLaunchTask);
    if (!okay(task.result)) { console.error('Launch skipped because the task failed.'); return { code: 1 }; }
    file = launch.program;
  }
  if (!await artifact(dir, file)) throw Error(`No ${file}. Run prepare or a build task first.`);
  console.log(`Launching ${file}`);
  const result = await execute(meta.language === 'typescript' ? [process.execPath, file] : [within(dir, file)], dir, { timeout: 30_000 });
  show(result);
  return result;
}

export async function prepare(item) {
  const { dir, meta } = item;
  await requireTypescript(meta);
  const seeds = await json(path.join(dir, 'support/seeds.json'));
  const seededFiles = [...new Set(seeds.map((seed) => seed.artifact))];
  for (const file of seededFiles)
    if (await exists(within(dir, file))) throw Error(`Preparation refused: ${file} already exists. Your outputs were kept.`);
  const scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'rian-workspace-seed-'));
  try {
    for (const file of meta.supportFiles) {
      const target = within(scratch, file);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.copyFile(within(dir, file), target);
    }
    const receipts = [];
    for (const seed of seeds) {
      const file = within(scratch, meta.source);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, seed.source);
      const result = await shell(seed.command, scratch);
      if (!okay(result)) { show(result); throw Error('Preparing the older artifact failed. Editable files were kept.'); }
      receipts.push({ artifact: seed.artifact, sourceHash: digest(seed.source), command: seed.command });
    }
    for (const file of seededFiles) {
      const target = within(dir, file);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.copyFile(within(scratch, file), target, constants.COPYFILE_EXCL);
    }
    await fs.mkdir(path.join(dir, '.workspace-state'), { recursive: true });
    await fs.writeFile(path.join(dir, '.workspace-state/seeds.json'), JSON.stringify(receipts, null, 2) + '\n');
    console.log('Older artifacts prepared. Your editable source was not changed.');
  } finally { await fs.rm(scratch, { recursive: true, force: true }); }
}

export async function buildCheck(item) {
  const { meta, dir } = item;
  let result, receipt;
  if (meta.level === 'hard') {
    result = await launchRun(item, 'Candidate preview');
    receipt = await json(path.join(dir, '.workspace-state/last-task.json'));
    const launch = (await json(path.join(dir, 'launch.json'))).configurations.find((row) => row.name === 'Candidate preview');
    if (launch.program !== meta.artifacts[1]) {
      console.error('SAMPLE MISMATCH — Candidate preview must target the alternate artifact.'); return 1;
    }
  } else {
    ({ result, receipt } = await taskRun(item, meta.level === 'easy' ? 'Build preview' : 'Build and run'));
    if (!okay(result)) return 1;
    if (meta.level === 'easy') result = await launchRun(item);
  }
  const target = meta.level === 'hard' ? meta.artifacts[1] : meta.artifacts[0];
  const expected = await fs.readFile(path.join(dir, 'sample.stdout'), 'utf8');
  const needsArtifact = meta.level !== 'medium';
  if (!okay(result) || result.stdout !== expected || (needsArtifact && !receipt.outputs[target]?.matchesSavedSource)) {
    console.error('SAMPLE MISMATCH — compare the task, selected artifact and expected banner.');
    console.error('Expected stdout:', JSON.stringify(expected));
    console.error('Actual stdout:  ', JSON.stringify(result.stdout));
    return 1;
  }
  console.log('PUBLIC OBSERVATION PASSED — manually test later edits and build failures; website acceptance is separate.');
  return 0;
}

async function doctor(language) {
  const tools = { typescript: [[process.execPath, '--version'], [process.execPath, tsc, '--version']], go: [['go', 'version']], rust: [['rustc', '--version'], ['cargo', '--version']], cpp: [[process.env.CXX || 'c++', '--version']] };
  if (language && !tools[language]) throw Error('Choose typescript, go, rust or cpp.');
  let failed = false;
  for (const [name, commands] of Object.entries(tools)) {
    if (language && name !== language) continue;
    for (const command of commands) {
      try {
        const result = await execute(command, root, { timeout: 10_000 });
        console.log(`${name}: ${(result.stdout || result.stderr).split('\n')[0]}`);
        if (!okay(result)) failed = true;
      } catch (error) { failed = true; console.error(error.message); }
    }
  }
  return failed ? 1 : 0;
}

export async function main([action = 'help', input, selection] = process.argv.slice(2)) {
  if (action === 'help') {
    console.log('workspace: list [filter] | doctor [language] | run <path> | check <path> | prepare <path> | task <path> "label" | launch <path> ["name"]'); return 0;
  }
  if (action === 'list') {
    for (const row of (await catalog()).exercises.filter((row) => !input || row.path.includes(input))) console.log(`${row.path}\n  ${row.title}`);
    return 0;
  }
  if (action === 'doctor') return doctor(input);
  if (!['run', 'check', 'prepare', 'task', 'launch'].includes(action)) throw Error(`Unknown action: ${action}`);
  const item = await exercise(input);
  if (item.meta.kind === 'coding') {
    if (!['run', 'check'].includes(action)) throw Error('This coding exercise supports run and check.');
    return codingRun(item, action === 'check');
  }
  if (action === 'prepare') { await prepare(item); return 0; }
  if (action === 'task') return okay((await taskRun(item, selection || 'Build preview')).result) ? 0 : 1;
  if (action === 'check') return buildCheck(item);
  return okay(await launchRun(item, selection)) ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => { process.exitCode = code; }, (error) => { console.error(error.message); process.exitCode = 1; });
}
