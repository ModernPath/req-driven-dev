---
name: rdd-engineering-check
description: Evaluate the complete flat set of active engineering constraints applicable to an exact planning, pre-delivery candidate, or delivered fingerprint. Use from RDD cold review and completion review. Produces a distinct engineering trace verdict and findings for each target; it does not replace technical review, change constraint authority, or advance lifecycle state.
---

# Check engineering constraints

Read the project `AGENTS.md`, canonical `PROCESS.md`
(`.modernpath/rdd/PROCESS.md` in a consuming repository), the authoritative
engineering-constraint records, selected scope, affected-surface
reconnaissance, relevant code and configuration, and current gate records.

## Procedure

1. Fix the evaluation target as `PLANNING`, `CANDIDATE`, or `DELIVERED`, with
   the selected Epic or SR scope, affected repository, revision, and exact
   packet or code fingerprint. Never reuse one target kind's result as another.
2. Resolve the complete flat set of `ACTIVE` ECs whose explicit scope matches
   the affected repository, language, service, domain, or path. Do not use
   profiles, inheritance, naming conventions, or presumed defaults. Record how
   each EC was included or excluded, honor its recorded effective point, and
   compare the result with the post-reconnaissance EC set in work selection.
   Ambiguous applicability or a set mismatch is a failure.
3. Evaluate every applicable EC using its declared verification method and
   direct `DOC:`, `CODE:`, `TEST:`, or `RUN:` evidence. Run deterministic
   commands when available. For `PLANNING`, assess the planned approach and its
   declared enforcement path at the reconnaissance revision. For `CANDIDATE`,
   evaluate the completed implementation before integration. For `DELIVERED`,
   rerun or confirm the check against the delivered revision.
4. Record each unmet or unevaluable EC as a finding with severity, direct
   source, owner, and `OPEN`, `RESOLVED`, `DEFERRED`, or `REJECTED`
   disposition. An EC is normative while active; a deferred or rejected
   finding does not make nonconformance pass.
5. Record a distinct engineering trace gate for the target kind, exact target
   fingerprint, and exact applicable EC-id set. Return `PASS` only when the set
   is complete, every applicable EC is proven conformant, and no applicability
   conflict is unresolved. If no EC applies, record `0 applicable`, the
   resolution basis, and `PASS`; silence is not an evaluated result.
6. Apply staleness only from the inputs owned by that result:
   - `PLANNING` becomes `STALE` when the selected scope, packet,
     reconnaissance revision or affected surface, applicable EC set, or an
     applicable EC changes. Approved implementation changes alone do not stale
     it.
   - `CANDIDATE` becomes `STALE` when its candidate code fingerprint or
     applicable EC set changes.
   - `DELIVERED` becomes `STALE` when its delivered fingerprint or applicable
     EC set changes.
7. Feed the findings and gate verdict to the invoking review. Candidate code
   that expands the approved affected surface invalidates planning rather than
   being treated as an ordinary code-fingerprint change.

Do not create, activate, edit, retire, or waive an EC during this check. Do not
make an architecture or engineering-policy decision, modify implementation to
clear a finding, grant cold-review or completion approval, or treat a proposed,
superseded, or retired EC as active.

## Report

Report the evaluated fingerprint and revision; applicable EC ids with the
scope match that selected each one; evidence and result per EC; exclusions,
ambiguities, and findings; the engineering trace-gate verdict; and the exact
handoff to the invoking cold or completion review.
