# Repair webhook creation

typescript · medium · heyrian-factory-v4-2-r3 · factory-lab-v4.3

[Read the lesson](https://heyrian.dev/patterns/factory?language=typescript) · [Open this lab](https://heyrian.dev/patterns/factory/lab?language=typescript&tab=heyrian-factory-v4-2-r3)

## Task

The notification service needs correct local receipts for API notices, scheduled summaries and manual resends.

Repair webhook creation and sending. A webhook needs its HTTPS endpoint, without a relay sender. A finished client keeps its creation-time tenant, endpoint and timeout when the draft or policy changes. Preserve the common send operation and all caller receipts.

- Apply current defaults when a choice is absent; preserve explicit sender/timeout choices and reject unusable configuration.
- Preserve API defaults, the scheduled 4000ms timeout and the support/tenant resend sender.
- Construct a webhook product using its required HTTPS endpoint, without requiring a relay sender.
- Keep a finished client’s creation-time configuration across draft/policy edits and successive messages; a failed construction stays rejected until rebuilt.

## Files

Start with `main.ts`. Supplied declarations and input adapters
are part of the exercise; keep their behavior. Save observations in `NOTES.md`.

- The TypeScript file includes both client operations, makeClient and the input handler. All required declarations are visible in the editor.
- B requests a client and emits no line. U asks that held client for a message receipt. After an unsuccessful B, U must print rejected until a B succeeds.
- R supplies tenant, provider, sender, endpoint and timeout fields; - omits a choice and ~ supplies empty text. P sets policy. A and S also request receipts.
- Webhook success prints tenant|webhook|endpoint|timeoutMs|message. The endpoint must start with https:// followed by at least one character, and a resolved timeout must be positive. These are local test receipts.

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
npx tsc -p tsconfig.json
node .workspace-build/main.js < sample.stdin
```

## Expected sample

Input and exact expected output live in `sample.stdin` and `sample.stdout`.
They contain the public example, not the website's full assessment suite.
Compare the result, explain your change, and use Check work on the site when
you want its assessment. Local work and website progress are separate.
