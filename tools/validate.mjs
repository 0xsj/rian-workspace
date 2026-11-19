import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { catalog, root, within } from './workspace.mjs';

const index = await catalog();
assert.equal(index.schema, 1);
const seen = new Set(), tickets = new Set();
for (const row of index.exercises) {
  assert.match(row.path, /^(heyrian|primerian)\/[a-z0-9-]+\/[a-z0-9-]+\/(typescript|go|rust|cpp)\/(easy|medium|hard)$/);
  assert.ok(!seen.has(row.path), `Duplicate path: ${row.path}`);
  seen.add(row.path);
  const dir = within(root, row.path);
  assert.equal(await fs.realpath(dir), dir, 'Exercise directories must not be symlinks');
  const meta = JSON.parse(await fs.readFile(path.join(dir, 'exercise.json'), 'utf8'));
  assert.equal(meta.path, row.path);
  assert.equal(meta.schema, 1);
  assert.equal(meta.ticket, row.ticket);
  assert.ok(meta.revision && meta.title);
  assert.ok(!tickets.has(`${meta.ticket}:${meta.language}`), `Duplicate edition: ${meta.ticket}`);
  tickets.add(`${meta.ticket}:${meta.language}`);
  const site = new URL(meta.lessonUrl);
  assert.equal(site.hostname, `${meta.site}.dev`);
  assert.equal(new URL(meta.labUrl).hostname, site.hostname);
  for (const file of ['README.md', 'NOTES.md', 'sample.stdin', 'sample.stdout', meta.source, ...meta.supportFiles])
    assert.ok((await fs.stat(within(dir, file))).isFile(), `Missing file: ${row.path}/${file}`);
  assert.ok(['coding', 'build-run'].includes(meta.kind));
  for (const [file, hash] of Object.entries(meta.starterHashes)) {
    within(dir, file);
    assert.match(hash, /^[a-f0-9]{64}$/);
  }
  if (meta.kind === 'coding') {
    for (const command of [meta.build, meta.run])
      assert.ok(Array.isArray(command) && command.length && command.every((part) => typeof part === 'string'));
  } else {
    assert.equal(meta.artifacts.length, 2);
    for (const file of meta.artifacts) within(dir, file);
    const seeds = JSON.parse(await fs.readFile(path.join(dir, 'support/seeds.json'), 'utf8'));
    assert.ok(seeds.length);
    for (const seed of seeds) {
      assert.ok(meta.artifacts.includes(seed.artifact));
      assert.ok(typeof seed.command === 'string' && typeof seed.source === 'string');
    }
  }
}

async function discover(dir) {
  const found = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !entry.name.startsWith('.')) found.push(...await discover(path.join(dir, entry.name)));
    else if (entry.name === 'exercise.json') found.push(path.relative(root, dir).split(path.sep).join('/'));
  }
  return found;
}
const disk = [...await discover(path.join(root, 'heyrian')), ...await discover(path.join(root, 'primerian'))];
assert.deepEqual(disk.sort(), [...seen].sort());
console.log(`Validated ${seen.size} exercise directories and their catalog identities.`);
