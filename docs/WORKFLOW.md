# Working through an exercise

1. Open the lesson and choose the same language and difficulty here.
2. Read the exercise README. Keep supplied readers and support files intact
   unless the task asks you to change them.
3. Run the starter, inspect the output, and make your change.
4. Run the public sample check. Record what you tested in `NOTES.md`.
5. Commit a useful attempt or milestone in your own repository.

From the workspace root, `npm run list -- rust` narrows the list to Rust.
Pass an exercise path to `run` or `check`. Once inside an exercise directory,
you can also invoke the tool by its relative path and pass `.` as the exercise.
Each generated README includes that exact command and native commands.

`run` compiles ordinary coding exercises and passes `sample.stdin` to the
program. `check` also compares stdout, stderr and the exit status with the public
sample. Compiler failure is reported separately from sample mismatch. Output
bytes matter, including newlines. The process has a 30-second execution limit;
builds have a 120-second limit.

Source and execution intentionally keeps building and launching separate. Run
`prepare` once to create the supplied older artifacts, inspect the saved task,
then use `task` and `launch` as its README describes. Preparation builds in a
temporary directory and refuses to overwrite an existing artifact. It never
replaces your editable source. Repeated runs retain outputs, so you can observe
an old executable after a failed build.

Build/run `check` evaluates one current-source observation. It records hashes
and reports output and whether a selected artifact was refreshed. It does not
run the website's private changed-source and failure probes or award acceptance.
Try those failure scenarios yourself using the reading.

The sample files contain the example already visible in the browser. Private
cases, reference solutions, credentials and account progress are not included.
Website access and completion remain managed by the sites.
