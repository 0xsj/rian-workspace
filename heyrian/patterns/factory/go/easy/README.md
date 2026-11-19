# Complete relay setup

go · easy · heyrian-factory-v4-1-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=go) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=go&tab=heyrian-factory-v4-1-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Complete relay setup in the common factory. The three callers are supplied; keep their requested choices and resolve missing values from the current policy.

- Apply current defaults when a choice is absent; preserve explicit sender/timeout choices and reject unusable configuration.
- Preserve API defaults, the scheduled 4000ms timeout and the support/tenant resend sender.

## Files

Start with `main.go`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- The Go file includes main, the request declarations and the caller adapters used by the sample.
- P supplies policy data. A selects a caller; R supplies the request for S. Within an R row, - leaves an optional field absent and ~ supplies empty text.
- A relay result prints tenant, relay, sender, timeout and message separated by |. Invalid setup must print rejected. No external message is sent.

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
