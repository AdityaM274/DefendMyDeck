# DefendMyDeck

A local pitch rehearsal prototype built for Build With AI: Basics. Paste a pitch, inspect editable claims against evidence you supply, and rehearse a question with the evidence visible.

## Run

Requires Node.js 24 or newer; no package installation or API key.

```sh
npm start
```

Open http://127.0.0.1:4173. Run `npm test` for the automated checks.

## Try it

1. Choose **Try a fictional example** and confirm replacement.
2. Open **Check the evidence**. CampusSort claims 94% but its fictional run note says 45/50 = 90%. Another claim presents a planned experiment as a measured improvement.
3. Correct a claim or add your own supporting note. A linked source is not independent verification.
4. Open **Take the hot seat**. Answer, review the explicit mention checklist, then revise. Compare attempts while judging their actual meaning yourself.
5. Optionally enable browser saving or export a JSON backup / Markdown report. Import replaces the workspace only after confirmation.

## What it actually does

The app uses deterministic claim patterns, numeric checks, question templates and a transparent source/method/limitation mention checklist. AI assisted development; no language model runs inside this version. Mention coverage does not measure correctness or predict a jury score. Negation and misleading statements can fool the checklist. Claim extraction can miss assertions; manually add or correct them. Sources are user supplied, not fetched or verified.

There are no runtime dependencies, analytics, external fonts or network API calls. The Node server binds to loopback and serves only allowlisted public assets. Browser storage is optional and unencrypted; shared-device users should avoid saving private material. Exported files contain the entered text. This is a prototype, not an independently audited security product.

CampusSort and all supplied sample results are fictional. Automated tests and agent browser checks are not user validation.

## Code map

- `public/core.js`: claim rules, feedback, backup validation and report generation.
- `public/app.js`: UI, optional local saving, source editing, imports and exports.
- `public/sample.js`: clearly labeled fictional example.
- `public/index.html` and `public/styles.css`: interface and responsive layout.
- `server.mjs`: local static server and response restrictions.
- `tests/`: behavior and server boundary checks.
- `devpost/`: draft scope, requirements, technical plan and honest review checklist. Private learner profile is ignored by Git.

## Development status

Initial working prototype, 18 October 2026. Six official Devpost skills were inspected and used from pinned source revision `a0f065781873e8a7ed9a9a705a8dafa6a0810439`. Planning defaults were inferred under the user's explicit instruction to start building; learner review remains pending. No public repository, demo video or final competition submission yet.
