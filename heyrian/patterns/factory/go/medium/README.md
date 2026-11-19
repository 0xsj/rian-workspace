# Repair webhook creation

go · medium · heyrian-factory-v4-2-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=go) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=go&tab=heyrian-factory-v4-2-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Repair webhook creation and sending. A webhook needs its HTTPS endpoint, without a relay sender. A finished client keeps its creation-time tenant, endpoint and timeout when the draft or policy changes. Preserve the common send operation and all caller receipts.

- Apply current defaults when a choice is absent; preserve explicit sender/timeout choices and reject unusable configuration.
- Preserve API defaults, the scheduled 4000ms timeout and the support/tenant resend sender.
- Construct a webhook product using its required HTTPS endpoint, without requiring a relay sender.
- Keep a finished client’s creation-time configuration across draft/policy edits and successive messages; a failed construction stays rejected until rebuilt.

## Files

Start with `main.go`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- main.go supplies main, MakeClient and Send operations in the same editable Go file.
- The B event requests a held NotificationClient without printing. U supplies its message; when the last B was unsuccessful, U must print rejected until another B succeeds.
- An R event carries tenant/provider/sender/endpoint/timeout. Its - fields are absent and its ~ fields are empty strings. P changes policy; A and S produce caller or request receipts.
- A webhook receipt contains tenant|webhook|endpoint|timeoutMs|message. Its endpoint requires the https:// prefix and a nonempty remainder; its timeout is positive. No transport connection is opened.

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
