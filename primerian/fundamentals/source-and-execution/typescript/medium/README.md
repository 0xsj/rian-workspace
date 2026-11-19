# Guard the preview workflow

typescript · medium · F-SRC-BUILD-V5-TYPESCRIPT-S2 · v5.1

[Read the lesson](https://primerian.dev/fundamentals/source-and-execution?language=typescript) · [Open this lab](https://primerian.dev/fundamentals/source-and-execution/lab?language=typescript&tab=F-SRC-BUILD-V5-TYPESCRIPT-S2)

## Task

The new marker works. Your teammate will use the saved Build and run task while reviewing further edits to the release-notes preview. An invalid edit must stop that task instead of showing an older or unchecked result.

Keep the working preview program. Repair the Build and run command in tasks.json so it validates the current saved source before execution. It must run valid input and skip execution when the source is invalid. Save the task before testing it.

- Run the current valid source through the saved Build and run task.
- After a failed check/build, do not launch a retained artifact or unchecked source.

## Files

Start with `main.ts`, `tasks.json`. Supplied declarations and input adapters
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
node ../../../../../tools/workspace.mjs task . "Build and run"
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
npx tsc main.ts --noEmitOnError --outDir out
node out/main.js
```

Existing outputs are retained across runs. Preparation refuses to overwrite an
output; it is not a reset command.

## Expected sample

Input and exact expected output live in `sample.stdin` and `sample.stdout`.
They contain the public example, not the website's full assessment suite.
Compare the result, explain your change, and use Check work on the site when
you want its assessment. Local work and website progress are separate.
