# Adding a local exercise

Use the same contract for both sites. A lesson has one canonical authoring home
in the website source repository; this directory is its learner-facing export.

1. Match the site's canonical module and lesson slug. Keep its current language,
   difficulty, ticket ID and content revision.
2. Export only explicitly selected starter files, learner-visible support and
   the already-public sample. Never serialize a full server ticket or copy
   private graders, solutions or hidden fixtures.
3. Preserve project filenames and the task's actual work. Do not flatten a
   multi-file exercise into an unrelated standalone example. Add a runner kind
   if execution needs a service or environment not currently supported.
4. Write a README with the goal, editable files, prerequisites, exact commands,
   expected sample behavior and link to the same website edition.
5. Add an `exercise.json` row to `workspace.json`. Hash original editable and
   support files; do not hash or treat a learner's modified copy as official.
6. Validate the directory, run the real native starter, confirm its expected
   incomplete behavior, and test a correct implementation separately. Do not
   distribute the correct implementation as part of that verification.
7. Record verified tool versions, scope and limitations in `docs/VERIFICATION.md`.

The initial exporter lives in the website source repository at
`scripts/authoring/learner-workspace/export.mjs`. It reads the three pilot lesson
definitions and this template. Regenerate into a fresh directory, review the
diff and keep learner repositories untouched. It exports snapshots; a website
edit does not automatically update an already-exported workspace.

Run `npm run verify` for structure and tooling tests. The starter programs are
exercises and can intentionally fail public samples, so these checks are separate
from infrastructure verification. Do not make CI require every unsolved starter
to pass, and do not infer website completion from local command exit status.

Before publishing more content, confirm its release/access disposition with the
owner. Service requirements, permitted redistribution and publication are
separate decisions from generating a local directory.
