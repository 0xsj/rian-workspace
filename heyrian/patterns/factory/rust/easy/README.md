# Complete relay setup

rust · easy · heyrian-factory-v4-1-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=rust) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=rust&tab=heyrian-factory-v4-1-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Complete relay setup in the common factory. The three callers are supplied; keep their requested choices and resolve missing values from the current policy.

- Apply current defaults when a choice is absent; preserve explicit sender/timeout choices and reject unusable configuration.
- Preserve API defaults, the scheduled 4000ms timeout and the support/tenant resend sender.

## Files

Start with `main.rs`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- main.rs contains the Rust entry point, ClientRequest and the relay operation used in this task.
- In the event script P sets policy and A asks for a caller receipt. R changes the request read by S; - represents None and ~ represents empty text.
- Relay output is tenant|relay|sender|timeoutMs|message followed by a newline. An invalid configuration must produce rejected. Sending only produces a local receipt.

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
