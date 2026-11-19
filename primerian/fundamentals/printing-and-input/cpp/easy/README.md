# Print the label exactly

cpp · easy · fundamentals-v4-printing-and-input-1 · v4.3

[Read the lesson](https://primerian.dev/fundamentals/printing-and-input?language=cpp) · [Open this lab](https://primerian.dev/fundamentals/printing-and-input/lab?language=cpp&tab=fundamentals-v4-printing-and-input-1)

## Task

The print studio checks proof labels in a command-line preview. Bring its displayed proof number and measurement into the required label layout so the operator can review the complete line.

Repair formatProof so the complete program prints proof NNN | width: W.WW cm. Use at least three ID digits, preserve longer IDs and keep two decimal places on the measurement. The supplied reader provides valid ID/width values; the entry point prints one terminating LF.

- Pad a short ID without truncating a longer ID.
- Keep two decimal places, literal separators and one final LF on stdout.

## Files

Start with `main.cpp`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- The C++ entry point uses getline and istringstream to obtain trusted metadata. formatProof owns the returned string; the supplied cout call adds its terminating LF.
- Input identifiers and double widths are nonnegative. Measurements have at most two fractional digits, so this task is about output layout rather than accepting input.

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
