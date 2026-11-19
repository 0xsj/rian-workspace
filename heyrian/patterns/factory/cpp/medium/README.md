# Repair webhook creation

cpp · medium · heyrian-factory-v4-2-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=cpp) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=cpp&tab=heyrian-factory-v4-2-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Repair webhook creation and sending. A webhook needs its HTTPS endpoint, without a relay sender. A finished client keeps its creation-time tenant, endpoint and timeout when the draft or policy changes. Preserve the common send operation and all caller receipts.

- Apply current defaults when a choice is absent; preserve explicit sender/timeout choices and reject unusable configuration.
- Preserve API defaults, the scheduled 4000ms timeout and the support/tenant resend sender.
- Construct a webhook product using its required HTTPS endpoint, without requiring a relay sender.
- Keep a finished client’s creation-time configuration across draft/policy edits and successive messages; a failed construction stays rejected until rebuilt.

## Files

Start with `main.cpp`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- main.cpp is compiled as C++23. Its request types, client operations and input entry point are included in the editable source.
- B requests a client to hold and prints nothing. U requests a receipt from the held client; after a failed B it must print rejected until a successful B replaces that result.
- An R line supplies tenant, provider, sender, endpoint and timeout; - denotes no value and ~ denotes empty text. P supplies policy, and A/S request immediate receipts.
- A valid webhook prints tenant|webhook|endpoint|timeoutMs|message. Its endpoint starts with https:// and has a nonempty remainder, and its timeout exceeds zero. All results are produced locally.

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
mkdir -p .workspace-build
c++ -std=c++23 -Wall -Wextra -pedantic main.cpp -o .workspace-build/program
./.workspace-build/program < sample.stdin
```

## Expected sample

Input and exact expected output live in `sample.stdin` and `sample.stdout`.
They contain the public example, not the website's full assessment suite.
Compare the result, explain your change, and use Check work on the site when
you want its assessment. Local work and website progress are separate.
