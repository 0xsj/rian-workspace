# rian-workspace

Keep your Heyrian and Primerian exercise code together, run it locally, and save
your attempts in your own Git repository.

## Start here

Install Node.js 22.18 or later, then run these commands from
this directory:

```sh
npm ci
npm run list
npm run doctor -- typescript
npm run run -- primerian/fundamentals/printing-and-input/typescript/easy
npm run check -- primerian/fundamentals/printing-and-input/typescript/easy
```

The starter deliberately needs work. `run` shows what your current program does;
`check` compares its output with the lesson's public sample. A failing starter
check is expected. Read the exercise's README for the task and lesson link.

For Rust, Go or C++, install that language's tools too. See [setup](docs/SETUP.md).
The tools execute your code on your machine; they are not a sandbox.

## Find your work

Both sites use the same structure:

```text
primerian/<module>/<lesson>/<language>/<difficulty>/
heyrian/<module>/<lesson>/<language>/<difficulty>/
```

Each exercise contains its original filenames, an `exercise.json` identity, a
README and a place for your notes. Language editions are independent projects;
you only need to work in the language you choose. The same Easy, Medium and Hard
labels appear on the site. The catalog lists only exercises included here.

The initial set has 36 exercises across three lessons, in TypeScript, Go, Rust
and C++:

| Site | Lesson | Local work |
| --- | --- | --- |
| Primerian | [Printing values and reading input](https://primerian.dev/fundamentals/printing-and-input) | Format labels, convert input, assemble lines |
| Primerian | [From source to a running program](https://primerian.dev/fundamentals/source-and-execution) | Inspect builds, repair tasks and connect a launcher |
| Heyrian | [Factory](https://heyrian.dev/patterns/factory) | Complete client creation and preserve queued work |

Source and execution has a different workflow: its README explains `prepare`,
`task` and `launch`. Its first `run` needs a compiled artifact, just as on the site.

## Keep your attempts

Use this directory as your own repository. Commit source, configuration and
`NOTES.md`; build outputs are ignored. Small commits let you compare attempts and
return to earlier versions. Git setup and the remote destination are yours to
choose; this directory has not been initialized or connected to GitHub.

You can paste code from the browser editor into the matching file. Automatic
browser export, GitHub saving and account progress synchronization are not wired
up in this initial version. Local sample results do not award website acceptance.

See [the learning workflow](docs/WORKFLOW.md),
[updating without losing work](docs/UPDATING.md) and
[adding exercises](docs/AUTHORING.md).
