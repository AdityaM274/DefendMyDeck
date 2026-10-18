---
doc: prd
status: draft
execution_authorization: user_requested_build_2026-10-18
---
# DefendMyDeck - Product Requirements

Source: scope.md > The Core Loop and The POC Boundary. Draft implementation defaults under user's explicit start-building instruction; not a fabricated completed interview.

## The Core Journey
1. Open an empty workspace or load the clearly fictional example.
2. Enter pitch title and slide text; scan for claim candidates.
3. Review claims, edit false positives, add missed claims and add evidence excerpts.
4. Choose a source for each claim; examine missing-number and planned/literature warnings.
5. Start rehearsal for a claim; write an answer; inspect transparent checks.
6. Write another attempt and compare; export a local report/backup.

## Screens and Layout
One workspace with three tabs: pitch, evidence audit and rehearsal. Persistent header includes local-only processing badge. Audit uses claim cards and evidence editor. Rehearsal shows the exact claim, source and question beside the answer box.

## Look and Feel
Assistant default: ivory background, serif editorial headlines, system sans-serif controls, strong contrast, orange primary actions, readable source excerpts. Responsive single column on small screens. Keyboard focus and explicit labels throughout.

## Features and Behavior
### Pitch and Claims
Paste up to 20,000 characters. Scan numbers, comparisons and strong outcome words. Each candidate is editable/removable; add manual claims the heuristic missed. Rescanning replaces derived claims and explicitly warns if it would discard work.

### Evidence Audit
Add source title, type (measured, literature, planned), excerpt and optional link. Associate manually. Show unlinked claims, numbers absent from the excerpt, and explicit source-type cautions. Linking a source never marks a claim true. Labels and method notes expose these limits. Evidence links are references only; no URL fetch.

### Rehearsal
Generate a question from claim type and evidence state. Record multiple typed attempts. Checklist checks source mention, relevant numeric anchors and a limitation phrase. Show rules and matched/missing items; no jury score. Source/claim edits invalidate the old question context; keep attempts only under an unchanged question snapshot.

### Persistence and Export
Memory-only by default. Optional "Save on this browser" checkbox writes locally; visible saved-state message and clear action. Export JSON backup and Markdown rehearsal report. Import validates schema/size before replacing current work. Never transmit pitch text.

## States and Boundaries
- Empty input: guidance, no fabricated claims.
- No candidates: manual-add option, no claim of a clean pitch.
- Evidence mismatch: warning with exact missing numbers, not invented correction.
- Storage unavailable: retain session in memory, display saving failure.
- User text: render as text, never executable HTML.
- Fictional sample: labeled in workspace and exports.

## Product Decisions
User chose event, solo entry and immediate build. Detailed UI and offline architecture are assistant defaults for review. Real learner feedback is outstanding.

## What We're Building
A working end-to-end traceable audit/rehearsal loop with editable data and honest limitations.

## Deferred From the POC
Model APIs, uploaded slide parsing and audio. These add integration complexity without being necessary to demonstrate this initial consistency-check kernel.

## Non-Goals
Independent fact verification, plagiarism judgment, legal certification, actual jury scoring or claims that the sample represents a real experiment.

## Open Questions
User review may change audience or workflow. Runtime generative AI could improve question diversity later, but must not be claimed implemented now.
