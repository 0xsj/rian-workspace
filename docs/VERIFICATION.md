# Verification

`npm run verify` checks the catalog, exercise identities, required files and
runner behavior. It does not require an unsolved starter to pass its sample.

When the maintainer runs native verification, `verification.json` in this
directory records the checked date, tool versions and per-exercise results.
That report covers the original exported starters and temporary corrected
implementations; it does not establish results for your later edits. Its scope
is public samples and local build/run observations, not the website's full
assessment or completion state.

The native verifier is maintained in the website source repository at
`scripts/authoring/learner-workspace/verify-native.mjs`. References are used only
inside temporary verification directories and are not delivered in this workspace.
