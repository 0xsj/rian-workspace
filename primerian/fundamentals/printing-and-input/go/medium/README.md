# Convert one input line

go · medium · fundamentals-v4-printing-and-input-2 · v4.3

[Read the lesson](https://primerian.dev/fundamentals/printing-and-input?language=go) · [Open this lab](https://primerian.dev/fundamentals/printing-and-input/lab?language=go&tab=fundamentals-v4-printing-and-input-2)

## Task

Add the operator’s count to the working proof-label preview. The label metadata is supplied for proof 8. A blank entry must appear as missing, a written zero must remain zero, and mistyped text such as 12x must appear as refused.

Implement countText. The supplied program reads one actual stdin line and passes the reader’s returned text to it. Return count missing for blank text, count refused for a failed complete conversion, or count: N for a valid count including zero. Preserve the working formatter and entry point.

- Accept the complete numeric text with surrounding whitespace; refuse digits followed by letters.
- Print a deliberately entered zero as count: 0; report blank and unusable text separately.
- Keep the earlier formatted proof label and exactly one output line.

## Files

Start with `main.go`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- Go ReadString passes its returned text, including a delimiter when present, to countText. The provided main also passes final nonempty text returned with io.EOF.
- Count cases contain ASCII digits, whitespace-only entries or digits followed by letters. Numeric values fit a signed 32-bit integer. Signed spellings, fractions and exponents are outside this exercise.

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
