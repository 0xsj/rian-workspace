# Preserve queued notices

rust · hard · heyrian-factory-v4-3-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=rust) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=rust&tab=heyrian-factory-v4-3-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Repair queued preparation and dispatch. Each queued notice keeps its original request/message and uses the policy current at dispatch. A rejected notice must not stop later queued notices.

- Keep each queued tenant, provider, optional choices and message unchanged when the editable draft is reused.
- Queued receipts use the policy current at dispatch for missing choices and configuration validity.
- Reject invalid notices independently; preserve each required receipt, insertion order and flush behavior.

## Files

Start with `main.rs`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- The Rust editor contains PreparedNotice, prepare, dispatch and the supplied main input loop.
- Q places a request/message notice in the queue. F requests the batch’s receipts in insertion order and leaves the queue empty. P and R supply policy and request events.
- For R, - is an absent optional value and ~ is empty text. A/S requests are immediate; B/U requests operate on a held client.
- Queued output must contain tenant|provider|address|timeoutMs|message, or rejected for an invalid notice. That rejection must not remove the results of the notices that follow it. Receipts involve no external delivery.

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
