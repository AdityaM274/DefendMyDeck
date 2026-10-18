---
doc: scope
status: draft
execution_authorization: user_requested_build_2026-10-18
---
# DefendMyDeck

A local pitch rehearsal tool that connects a claim, the supplied evidence and a pointed practice question.

## Decision Record
The user approved proceeding with the recommended event and instructed immediate implementation. This draft records the assistant's proportionate defaults for a working prototype; it does not pretend the unanswered curriculum interview or a document-by-document approval occurred. The first live review can revise these choices.

## The Unique Kernel
Traceability: a rehearsal question is anchored to an exact pitch claim and its evidence gap. A second answer can address that specific gap, with visible checklist changes instead of a mysterious AI score.

## Who It's For
A solo student builder preparing a hackathon pitch who needs to distinguish what is measured, planned and merely asserted.

## The Core Loop
Paste pitch text -> inspect candidate claims -> attach evidence and inspect numeric mismatches -> answer a claim-specific question -> revise the answer -> export the record.

## Inspiration & Identity
Assistant design default: a calm editorial workspace, warm paper, dark ink and burnt-orange highlights. No branding copied from another product.

## Why This Matters to the Learner
User will personally present competition work. A rehearsal tool can expose unsupported claims before that presentation; actual usefulness still needs their feedback.

## What "Working" Looks Like
A clearly fictional sample states 94% accuracy while its supplied run note says 90%. The tool flags the numeric mismatch, asks how accuracy was measured, and shows whether the answer mentions a source, measurement and limitation. User edits the claim to 90%, re-audits, and sees the numeric warning resolve. This is a consistency check, not proof that the experiment happened.

## The POC Boundary
Pasted text, editable claims, manual evidence links, deterministic numeric/word checks, claim-specific questions, two-attempt comparison, optional local saving and exports. No runtime model or paid service is necessary; AI assistance is used in development.

## Later
PPTX/PDF parsing, optional grounded language-model questions, audio transcription and user studies after the core loop is validated.

## Explicitly Cut
Accounts/cloud sync (unnecessary for one-person rehearsal); emotion/confidence inference from faces or voices (not justified); automatic web verification (not implemented); predicted judge/winning scores (no evidence supports them).
