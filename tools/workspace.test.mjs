import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execute, within, codingRun, launchRun, prepare, taskRun } from './workspace.mjs';

test('file paths cannot leave the exercise directory', () => {
  assert.throws(() => within('/tmp/exercise', '../other'));
  assert.throws(() => within('/tmp/exercise', '/etc/passwd'));
  assert.equal(within('/tmp/exercise', 'src/main.rs'), '/tmp/exercise/src/main.rs');
});
test('real child results retain stdout, stderr and nonzero status independently', async () => {
  const result = await execute([process.execPath, '-e', 'console.log("out");console.error("err");process.exit(7)'], os.tmpdir());
  assert.equal(result.code, 7);
  assert.equal(result.stdout, 'out\n');
  assert.equal(result.stderr, 'err\n');
});
test('a hanging program is stopped and cannot count as a success', async () => {
  const result = await execute([process.execPath, '-e', 'setInterval(()=>{},1000)'], os.tmpdir(), { timeout: 150 });
  assert.equal(result.timedOut, true);
  assert.notEqual(result.code, 0);
});
test('compile failure never launches a retained executable', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'rian-workspace-test-'));
  try {
    const result = await codingRun({ dir, meta: {
      language: 'go', build: [process.execPath, '-e', 'process.exit(2)'],
      run: [process.execPath, '-e', 'require("fs").writeFileSync("launched", "bad")']
    } });
    assert.equal(result, 1);
    await assert.rejects(fs.access(path.join(dir, 'launched')));
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
test('a launch skips a retained artifact after its prerequisite task fails', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'rian-workspace-test-'));
  try {
    await fs.writeFile(path.join(dir, 'main.go'), 'saved source');
    await fs.writeFile(path.join(dir, 'preview'), 'older artifact');
    await fs.writeFile(path.join(dir, 'tasks.json'), JSON.stringify({ tasks: [{ label: 'Broken', command: 'exit 1' }] }));
    await fs.writeFile(path.join(dir, 'launch.json'), JSON.stringify({ configurations: [{ name: 'Candidate preview', preLaunchTask: 'Broken', program: 'preview' }] }));
    const result = await launchRun({ dir, meta: { language: 'go', source: 'main.go', artifacts: ['preview', 'preview-next'] } }, 'Candidate preview');
    assert.equal(result.code, 1);
    assert.equal(await fs.readFile(path.join(dir, 'preview'), 'utf8'), 'older artifact');
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
test('preparation refuses to overwrite an existing artifact or editable source', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'rian-workspace-test-'));
  try {
    await fs.mkdir(path.join(dir, 'support'));
    await fs.writeFile(path.join(dir, 'main.go'), 'my edit');
    await fs.writeFile(path.join(dir, 'preview'), 'my binary');
    await fs.writeFile(path.join(dir, 'support/seeds.json'), JSON.stringify([{ artifact: 'preview', source: 'older', command: 'false' }]));
    await assert.rejects(prepare({ dir, meta: { language: 'go' } }), /already exists/);
    assert.equal(await fs.readFile(path.join(dir, 'main.go'), 'utf8'), 'my edit');
    assert.equal(await fs.readFile(path.join(dir, 'preview'), 'utf8'), 'my binary');
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
test('no-op builds retain known provenance, while changed source does not inherit it', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'rian-workspace-test-'));
  try {
    await fs.writeFile(path.join(dir, 'main.go'), 'source A');
    const command = `${JSON.stringify(process.execPath)} -e 'require("fs").writeFileSync("preview", "binary A")'`;
    await fs.writeFile(path.join(dir, 'tasks.json'), JSON.stringify({ tasks: [{ label: 'Build', command }] }));
    const item = { dir, meta: { language: 'go', source: 'main.go', artifacts: ['preview', 'preview-next'] } };
    const first = await taskRun(item, 'Build');
    assert.equal(first.receipt.outputs.preview.matchesSavedSource, true);
    await fs.writeFile(path.join(dir, 'tasks.json'), JSON.stringify({ tasks: [{ label: 'Build', command: 'true' }] }));
    const again = await taskRun(item, 'Build');
    assert.equal(again.receipt.outputs.preview.refreshed, false);
    assert.equal(again.receipt.outputs.preview.matchesSavedSource, true);
    await fs.writeFile(path.join(dir, 'main.go'), 'source B');
    const changed = await taskRun(item, 'Build');
    assert.equal(changed.receipt.outputs.preview.matchesSavedSource, false);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
