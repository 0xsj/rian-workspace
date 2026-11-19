# Preserve queued notices

go · hard · heyrian-factory-v4-3-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=go) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=go&tab=heyrian-factory-v4-3-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Repair queued preparation and dispatch. Each queued notice keeps its original request/message and uses the policy current at dispatch. A rejected notice must not stop later queued notices.

- Keep each queued tenant, provider, optional choices and message unchanged when the editable draft is reused.
- Queued receipts use the policy current at dispatch for missing choices and configuration validity.
- Reject invalid notices independently; preserve each required receipt, insertion order and flush behavior.

## Files

Start with `main.go`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- PreparedNotice, Prepare, Dispatch and main are in the editable Go file. Input parsing is supplied.
- Q appends the request/message notice and F requests all queued receipts in order, then clears the batch. P sets tenant policy; R provides request fields.
- Optional R fields use - for absence and ~ for empty text. A or S requests an immediate receipt; B followed by U requests and uses a held client.
- The output fields are tenant|provider|address|timeoutMs|message. Invalid notices produce rejected individually, and later queued work must still produce its own result. No network service is called.

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
go run . < sample.stdin
```

## Expected sample

Input and exact expected output live in `sample.stdin` and `sample.stdout`.
They contain the public example, not the website's full assessment suite.
Compare the result, explain your change, and use Check work on the site when
you want its assessment. Local work and website progress are separate.
