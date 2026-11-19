# Build the line reader

go · hard · fundamentals-v4-printing-and-input-3 · v4.4

[Read the lesson](https://primerian.dev/fundamentals/printing-and-input?language=go) · [Open this lab](https://primerian.dev/fundamentals/printing-and-input/lab?language=go&tab=fundamentals-v4-printing-and-input-3)

## Task

Extend the preview to show several count entries for the same proof, one per input line. An operator needs to see the original entry beside its converted result to inspect spaces, leading zeroes and refused text. This version’s supplied stdin adapter delivers fragments, so the preview must recover complete lines before printing them.

Implement LinePrinter.Push and LinePrinter.Finish. The supplied adapter reads real stdin and delivers short text fragments, not complete lines. Reconstruct the input lines and pass each one to the working emitLine helper exactly once, in order. It prints the proof label, converted count and quoted original text. Keep LF and CRLF endings out of the line text; preserve every other character. At EOF, include final text without a line ending and produce no extra record.

- Join text split across fragments and handle several line endings within one fragment, without losing or duplicating a line.
- Recognize LF and CRLF even across fragments; remove only the CR that belongs to a CRLF ending.
- Preserve the original spaces and tabs in the displayed input while the supplied converter normalizes its own copy.
- Keep blank lines, a valid zero and final unterminated text. Empty input and a final newline must not produce a phantom record; a final lone CR remains content.

## Files

Start with `main.go`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- The supplied Go adapter invokes Push for each nonempty fragment of at most three ASCII bytes and Finish after reading ends. Formatting, count conversion and emitLine are supplied.
- Input is limited to digits, letters, spaces, tabs, CR and LF; digit-only counts fit a signed 32-bit integer. Signs, fractions and exponents do not occur. strconv.Quote handles visible escapes in the output.
- LF and CRLF terminate lines; other CR bytes are content. Assessment compares completed stdout, so a correct buffered solution is valid without a timing or memory requirement.

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
