# Complete relay setup

cpp · easy · heyrian-factory-v4-1-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=cpp) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=cpp&tab=heyrian-factory-v4-1-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Complete relay setup in the common factory. The three callers are supplied; keep their requested choices and resolve missing values from the current policy.

- Apply current defaults when a choice is absent; preserve explicit sender/timeout choices and reject unusable configuration.
- Preserve API defaults, the scheduled 4000ms timeout and the support/tenant resend sender.

## Files

Start with `main.cpp`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- The C++23 program in main.cpp includes the entry point and the supplied relay caller functions.
- P records a policy and A invokes a caller. R fills the request consumed by S. The R tokens - and ~ mean absent and explicitly empty, respectively.
- The required relay line is tenant|relay|sender|timeoutMs|message. Rejected setup prints rejected instead. The program produces local text only.

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
