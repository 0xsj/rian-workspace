# Verify the review build

rust · easy · F-SRC-BUILD-V5-RUST-S1-R2 · v5.3

[Read the lesson](https://primerian.dev/fundamentals/source-and-execution?language=rust) · [Open this lab](https://primerian.dev/fundamentals/source-and-execution/lab?language=rust&tab=F-SRC-BUILD-V5-RUST-S1-R2)

## Task

Your teammate is reviewing an internal change to the release-notes preview. Its banner text stays the same, so the printed marker alone cannot identify the review copy. Establish which saved revision produced the file they will open.

Make the saved Build preview task produce target/debug/preview from the current saved src/main.rs. Launch that file and keep its expected banner, "preview: checked". The artifact details must connect this review copy to the saved revision.

- Keep the expected preview: checked banner.
- Build preview must successfully produce the launched artifact from the current saved source.

## Files

Start with `src/main.rs`, `tasks.json`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- Local files persist between commands; the website reconstructs its recorded workspace in a sandbox. Save files before running commands.
- The public check observes the current saved workflow only. Include the reading’s invalid-source attempt yourself; a valid-source run alone is insufficient.

## Run locally

Run `npm ci` once from the workspace root. Install the selected native tools
using [the setup guide](../../../../../docs/SETUP.md). Then, from this directory:

First prepare the older supplied artifact. This builds in a temporary
directory and keeps your editable files intact:

```sh
node ../../../../../tools/workspace.mjs prepare .
node ../../../../../tools/workspace.mjs run .
node ../../../../../tools/workspace.mjs task . "Build preview"
node ../../../../../tools/workspace.mjs run .
node ../../../../../tools/workspace.mjs check .
```

Read and edit `tasks.json`. Tasks here use the small schema from
the website, not VS Code's tasks schema. The root VS Code task menu can invoke
the workspace commands. Build and launch remain separate operations.

The public check covers one current-source observation. Test a later banner
and the reading's invalid-source attempt yourself. A successful command may
still have launched an old artifact. No local result awards website acceptance.

The task runner reports retained/refreshed output hashes and writes command and
saved-source receipts under ignored `.workspace-state/`. Preparation receipts
record the earlier sources separately. To inspect native behavior directly,
run a command from `tasks.json` in this directory; the ordinary build is:

```sh
cargo build
./target/debug/preview
```

Existing outputs are retained across runs. Preparation refuses to overwrite an
output; it is not a reset command.

## Expected sample

Input and exact expected output live in `sample.stdin` and `sample.stdout`.
They contain the public example, not the website's full assessment suite.
Compare the result, explain your change, and use Check work on the site when
you want its assessment. Local work and website progress are separate.
