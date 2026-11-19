# Preserve queued notices

cpp · hard · heyrian-factory-v4-3-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=cpp) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=cpp&tab=heyrian-factory-v4-3-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Repair queued preparation and dispatch. Each queued notice keeps its original request/message and uses the policy current at dispatch. A rejected notice must not stop later queued notices.

- Keep each queued tenant, provider, optional choices and message unchanged when the editable draft is reused.
- Queued receipts use the policy current at dispatch for missing choices and configuration validity.
- Reject invalid notices independently; preserve each required receipt, insertion order and flush behavior.

## Files

Start with `main.cpp`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- This C++23 source includes PreparedNotice, prepare, dispatch and the complete input entry point.
- Q requests a queued notice and F requests the queued receipts in their original order, clearing the batch. P updates tenant policy and R provides request data.
- R encodes absent choices with - and empty text with ~. A/S requests produce immediate receipts; B/U requests construct and use a held client.
- The required queued line is tenant|provider|address|timeoutMs|message, with rejected used for an invalid notice. The notices after it still print their own required results. This executable performs no external delivery.

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
