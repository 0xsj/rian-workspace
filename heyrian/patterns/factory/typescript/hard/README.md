# Preserve queued notices

typescript · hard · heyrian-factory-v4-3-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=typescript) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=typescript&tab=heyrian-factory-v4-3-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Repair queued preparation and dispatch. Each queued notice keeps its original request/message and uses the policy current at dispatch. A rejected notice must not stop later queued notices.

- Keep each queued tenant, provider, optional choices and message unchanged when the editable draft is reused.
- Queued receipts use the policy current at dispatch for missing choices and configuration validity.
- Reject invalid notices independently; preserve each required receipt, insertion order and flush behavior.

## Files

Start with `main.ts`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- The TypeScript source contains prepare, dispatch, PreparedNotice and the complete event loop for this task.
- Q submits the current request and message to the queue; F requests its receipts in insertion order and empties that queue. P sets policy and R supplies the next request.
- R uses - for an absent choice and ~ for empty text. A/S request immediate receipts, while B/U request and use a held client.
- Each queued result is tenant|provider|address|timeoutMs|message or rejected. Receipts queued after a failed notice must still print. The send operation remains local.

## Run locally

Run `npm ci` once from the workspace root. Install the selected native tools
using [the setup guide](../../../../../docs/SETUP.md). Then, from this directory:

```sh
node ../../../../../tools/workspace.mjs run .
node ../../../../../tools/workspace.mjs check .
```

These commands use `sample.stdin`; check compares exact output with
`sample.stdout`. The incomplete starter is expected to fail that comparison.

Native commands, from this directory after root setup:

```sh
npx tsc -p tsconfig.json
node .workspace-build/main.js < sample.stdin
```

## Expected sample

Input and exact expected output live in `sample.stdin` and `sample.stdout`.
They contain the public example, not the website's full assessment suite.
Compare the result, explain your change, and use Check work on the site when
you want its assessment. Local work and website progress are separate.
