---
doc: spec
status: draft
execution_authorization: user_requested_build_2026-10-18
---
# DefendMyDeck - Technical Spec

## How This Works, In Plain Language
The browser keeps the pitch in memory and runs explicit text rules against the evidence you supply. A tiny local server serves only this application's static files. No model service or cloud database receives the deck. Saving is optional on this browser. These are assistant-selected implementation defaults under direct build authorization, not claimed learner-authored architecture decisions.

## The Core Journey Through the System
Text form -> claim extraction -> editable claim/source records -> numeric consistency audit -> question snapshot -> typed attempts and transparent checks -> JSON/Markdown export. Implements prd.md > The Core Journey.

## Stack
Node 24+ built-in HTTP server and test runner; browser JavaScript modules, HTML and CSS. No package dependencies. Docs: https://nodejs.org/docs/latest-v24.x/api/http.html and https://nodejs.org/docs/latest-v24.x/api/test.html . Browser storage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage . Offline operation removes API cost and data-transfer risk; questions are less flexible than a language model.

## Where It Runs and How Someone Tries It
`npm start` or `node server.mjs`; open http://127.0.0.1:4173 . `npm test` runs core and server checks. No install, credentials or network API needed. Public repo/video remain future shipping work; no deployment is implied.

## Look and Feel
Implements prd.md > Look and Feel through CSS variables and native controls. No remote fonts/CDNs. Sidebar steps become horizontal on mobile; source cards and forms stack.

## Components
### Core Rules
public/core.js exports extraction, normalized numeric anchors, audit, question generation, answer checklist, backup validation and report rendering. Pure functions support meaningful fixture tests. Implements Pitch and Claims, Evidence Audit and Rehearsal.
### Browser Workspace
public/app.js holds state and DOM rendering. Every user-provided string is assigned through textContent or escaped before template rendering. Editing evidence/claims recalculates audit. Implements all PRD behaviors.
### Local Server
server.mjs serves an explicit allowlist of public files only on loopback, with content types and conservative headers. No file writes, user upload endpoints or arbitrary path access.

## Data Model
Workspace version 1: title, pitch, sample flag, claims [{id,text,sourceId}], sources [{id,title,type,excerpt,url}], rehearsals keyed by claim and immutable context containing attempts. Browser-saving consent stays separate from exported workspace data. Import requires strict field types and bounded text/counts; refuses stale/unknown versions.

## File Structure
```
app/
  server.mjs          # allowlisted loopback static server
  package.json       # start/test scripts, no dependencies
  public/
    index.html       # accessible forms and workspace
    styles.css       # responsive editorial UI
    core.js          # testable audit/rehearsal rules
    app.js           # state, rendering and event handlers
    sample.js        # clearly fictional demonstration
  tests/             # behavior fixtures and HTTP boundary checks
  devpost/           # planning and build record; profile ignored
```

## External Services and Dependencies
None at runtime. Reference URLs are not automatically fetched. No secrets, authentication, model calls or telemetry. Node installed locally; browser provided by user.

## Important Failure Modes
- Text heuristics miss claims: show manual-add/edit controls and limitations.
- Evidence numbers overlap accidentally: numeric agreement is labeled limited consistency, not support/verification.
- Changed source/claim makes attempt comparison misleading: snapshot context; regenerate rehearsal and clear incompatible attempts.
- Browser storage disabled/full: catch error and retain in memory; export remains usable.

## What Was Simplified and Why
Text paste instead of slide parsing; typed rehearsal instead of recording; transparent rules instead of model-generated scores. No simulated API calls or fake evidence.

## Decisions and Open Issues
User requested immediate build after concept proposal; no document-by-document approvals inferred. All planning docs remain draft for first review. No learner uncertainty or proficiency was invented. Early prototype will resolve whether traceability is useful; hands-on feedback is still required before marking curriculum complete.
