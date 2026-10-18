---
doc: checklist
status: draft
execution_authorization: user_requested_build_2026-10-18
---
# Build Checklist

Build mode: fast, inferred from the explicit immediate-build instruction. User can change pace. Skill interview/document approval pauses are superseded for prototype implementation by that direct instruction; no completed learning/review is fabricated.

## Slices
- [ ] **1. Audit a real pitch against supplied evidence**
  Becomes usable: Local app extracts editable claims and exposes numeric gaps for linked evidence.
  Why now: Demonstrates the distinctive traceability behavior first.
  PRD ref: `prd.md > Evidence Audit`
  Spec ref: `spec.md > Core Rules`, `spec.md > Browser Workspace`, `spec.md > Local Server`
  Build: Add local server, pure audit rules, pitch and source forms, fictional sample and responsive UI.
  Verify (mechanical): Test mismatch vs aligned metrics, planned sources, empty input; run app and inspect browser audit.
  Learner check: Load the sample, link the run note and inspect why 94% differs from 90%.
  Commit: `Build local claim and evidence audit`
- [ ] **2. Rehearse and compare two answers**
  Becomes usable: Question grounded in a specific claim/source; explicit answer checklist and retry history.
  Why now: Closes the evidence-to-rehearsal loop.
  PRD ref: `prd.md > Rehearsal`
  Spec ref: `spec.md > Core Rules`, `spec.md > Data Model`
  Build: Generate questions, snapshot context, record and compare attempts, invalidate stale context.
  Verify (mechanical): Test numeric/source/limitation checks and context invalidation; use both attempts in browser.
  Learner check: Answer once, revise with a source and limitation, judge whether the feedback is useful.
  Commit: `Add traceable rehearsal and attempt comparison`
- [ ] **3. Keep and export the session safely**
  Becomes usable: Optional browser saving, validated backup import and portable report export.
  Why now: A rehearsal record should survive user-controlled saving without silent disclosure.
  PRD ref: `prd.md > Persistence and Export`
  Spec ref: `spec.md > Data Model`, `spec.md > Important Failure Modes`
  Build: Add optional saving, reset confirmation, schema checks, exports and factual README.
  Verify (mechanical): Test backup validation and report contents; browser reload/import/export and inspect console.
  Learner check: Save/reload or export a backup and inspect that private text stays local.
  Commit: `Add local saving backups and rehearsal report`

## Hands-on Checkpoints
- [ ] User tries early working prototype and provides feedback.
- [ ] Final kick-the-tires feedback completed.

## Final Review
- [ ] Revisions resolved and learner confirms ready to ship.

## Code Tour and App Map
- [ ] Learning activity completed; do not mark from an agent-only explanation.
- [ ] Optional edit/transfer reflection offered or covered.
- [ ] App map generated and shown.

## Revisions

## Agent verification checkpoint — 18 October
All three implementation slices are present in one integrated initial prototype. Mechanical verification:16 tests passed and browser flows checked (see ../../evidence/verification-2026-10-18.md). Unchecked slice boxes retain learner review requirements; they do not imply absent code. Proposed per-slice commit labels above were planning intentions; actual history uses one initial checkpoint. Human checkpoints remain pending. Live textarea audit refresh bug fixed during browser verification.

Shipping authorization: user explicitly delegated autonomous completion/publication/submission on18 October2026. App-map reference generated. Human learning checkpoints remain unclaimed. Repository created; uploads in progress. MIT license added to satisfy open-source sharing. No final submission receipt yet.
