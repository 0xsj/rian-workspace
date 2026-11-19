# Repair webhook creation

rust · medium · heyrian-factory-v4-2-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=rust) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=rust&tab=heyrian-factory-v4-2-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Repair webhook creation and sending. A webhook needs its HTTPS endpoint, without a relay sender. A finished client keeps its creation-time tenant, endpoint and timeout when the draft or policy changes. Preserve the common send operation and all caller receipts.

- Apply current defaults when a choice is absent; preserve explicit sender/timeout choices and reject unusable configuration.
- Preserve API defaults, the scheduled 4000ms timeout and the support/tenant resend sender.
- Construct a webhook product using its required HTTPS endpoint, without requiring a relay sender.
- Keep a finished client’s creation-time configuration across draft/policy edits and successive messages; a failed construction stays rejected until rebuilt.

## Files

Start with `main.rs`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- This Rust task uses the complete main.rs program, including make_client, send and all custom enum and request declarations.
- B asks for a held client. U emits its receipt for the given message. After a failed B, U must print rejected until a later B succeeds.
- R provides a tenant, provider and optional sender/endpoint/timeout choices. Here - means None and ~ means an empty string. P sets policy data, while A and S request immediate receipts.
- The webhook output contract is tenant|webhook|endpoint|timeoutMs|message. A positive timeout and https:// with at least one following character are required. The send operation has no network effects.

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
cargo run --quiet --locked < sample.stdin
```

## Expected sample

Input and exact expected output live in `sample.stdin` and `sample.stdout`.
They contain the public example, not the website's full assessment suite.
Compare the result, explain your change, and use Check work on the site when
you want its assessment. Local work and website progress are separate.
