---
name: rdd-engineering-check
description: Evaluate the complete flat set of active engineering constraints applicable to an exact requirement scope and fingerprint. Use from RDD cold review for the planned change and from completion review for the delivered revision. Produces an engineering trace verdict and findings; it does not replace technical review, change constraint authority, or advance lifecycle state.
---

# Check engineering constraints

Read the project `AGENTS.md`, canonical `PROCESS.md`
(`.modernpath/rdd/PROCESS.md` in a consuming repository), the authoritative
engineering-constraint records, selected scope, affected-surface
reconnaissance, relevant code and configuration, and current gate records.

## Procedure

1. Fix the evaluation target: selected Epic or SR scope, affected repository,
   planning or delivered revision, and exact content/code fingerprint.
2. Resolve the complete flat set of `ACTIVE` ECs whose explicit scope matches
   the affected repository, language, service, domain, or path. Do not use
   profiles, inheritance, naming conventions, or presumed defaults. Record how
   each EC was included or excluded and honor its recorded effective point;
   ambiguous applicability is a failure.
3. Evaluate every applicable EC using its declared verification method and
   direct `DOC:`, `CODE:`, `TEST:`, or `RUN:` evidence. Run deterministic
   commands when available. During cold review, assess the planned approach and
   its declared enforcement path at the reconnaissance revision. During
   completion review, evaluate the delivered implementation itself.
4. Record each unmet or unevaluable EC as a finding with severity, direct
   source, owner, and `OPEN`, `RESOLVED`, `DEFERRED`, or `REJECTED`
   disposition. An EC is normative while active; a deferred or rejected
   finding does not make nonconformance pass.
5. Record an engineering trace gate for the exact target fingerprint and the
   exact applicable EC-id set. Return `PASS` only when the set is complete,
   every applicable EC is proven conformant, and no applicability conflict is
   unresolved. If no EC applies, record `0 applicable`, the resolution basis,
   and `PASS`; silence is not an evaluated result.
6. Feed the findings and gate verdict to the invoking review. A changed code,
   packet, affected surface, EC statement, EC scope, EC status, or verification
   method makes the result `STALE`.

Do not create, activate, edit, retire, or waive an EC during this check. Do not
make an architecture or engineering-policy decision, modify implementation to
clear a finding, grant cold-review or completion approval, or treat a proposed,
superseded, or retired EC as active.

## Report

Report the evaluated fingerprint and revision; applicable EC ids with the
scope match that selected each one; evidence and result per EC; exclusions,
ambiguities, and findings; the engineering trace-gate verdict; and the exact
handoff to the invoking cold or completion review.
