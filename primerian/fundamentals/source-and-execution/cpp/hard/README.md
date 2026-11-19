# Repair the demo launcher

cpp · hard · F-SRC-BUILD-V5-CPP-S3-R2 · v5.2

[Read the lesson](https://primerian.dev/fundamentals/source-and-execution?language=cpp) · [Open this lab](https://primerian.dev/fundamentals/source-and-execution/lab?language=cpp&tab=F-SRC-BUILD-V5-CPP-S3-R2)

## Task

The team wants a separate candidate preview for the demo alongside the everyday development output. Your teammate will use Candidate preview in launch.json. Keep that launch connected to the source they are reviewing.

Make Candidate preview in launch.json build and launch preview-next from the current saved source. A later banner edit must appear there, and a failed build must prevent launch even when older outputs remain. Keep the supplied everyday Build and run workflow working.

- Produce and launch preview-next from the current saved source.
- A later saved marker must appear without selecting a stale output.
- A failing build must stop execution even when both older outputs still exist.

## Files

Start with `main.cpp`, `tasks.json` and `launch.json`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- Local files persist between commands; the website reconstructs its recorded workspace in a sandbox. Save files before running commands.
- The public check observes the current saved workflow only. Include the reading’s invalid-source attempt yourself; a valid-source run alone is insufficient.

## Run locally

Run `npm ci` once from the workspace root. Install the selected native tools
using [the setup guide](../../../../../docs/SETUP.md). Then, from this directory:

First prepare the older supplied artifacts. This builds in a temporary
directory and keeps your editable files intact:

```sh
node ../../../../../tools/workspace.mjs prepare .
node ../../../../../tools/workspace.mjs run .
node ../../../../../tools/workspace.mjs task . "Build preview"
node ../../../../../tools/workspace.mjs launch . "Candidate preview"
node ../../../../../tools/workspace.mjs check .
```

Read and edit `tasks.json` and `launch.json`. Tasks here use the small schema from
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
g++ -std=c++23 -Wall -Wextra -pedantic main.cpp -o preview
./preview
```

Existing outputs are retained across runs. Preparation refuses to overwrite an
output; it is not a reset command.

## Expected sample

Input and exact expected output live in `sample.stdin` and `sample.stdout`.
They contain the public example, not the website's full assessment suite.
Compare the result, explain your change, and use Check work on the site when
you want its assessment. Local work and website progress are separate.
