---
name: rdd-acceptance
description: Draft and complete the acceptance test guide for a slice, Epic, or requirement after its full verification at the delivered revision and before the completion trace, hand it to a human tester, and record the tester's acceptance test results. Use inside completion review when the project's gate rules require the guide, or when a tester will check the change by hand. Grants no completion and is not the as-built acceptance of an existing baseline.
---

# Write and run the acceptance test guide

Read the project `AGENTS.md`, canonical `PROCESS.md`
(`.modernpath/rdd/PROCESS.md` in a consuming repository) — especially
§Evidence and completion's acceptance test step and §Project gate rules — the
shape `file-state/ACCEPTANCE-GUIDE.md`, and the project's gate rules
(`process/rdd-human-gates.md`). In ModernPath, the installed `mp-process-cli`
skill names the commands that draft and show the guide and record results.

## When

Run this step after the full verification at the delivered revision — for a
slice, its one full verification — and before the completion trace.

Draft the guide after the last record edit of the scopes it covers. Its
header records the aggregate of every covered scope at drafting, and any
later record or packet edit moves that aggregate and makes the guide stale.
If a record must change after drafting, draft again; earlier tester passes
recorded before the new draft are no longer current.

## Procedure

1. Read the `acceptance_guide` and `tester_signoff` rows of the project's
   gate rules. Expired, refused, or missing rules mean the default preset:
   the guide is required for a slice and the tester's sign-off is not.
2. Draft the guide at its path — `process/slices/<SLICE-id>/acceptance-guide.md`
   beside the slice file, or `process/acceptance/<scope>.md` outside a
   slice — through the project's sanctioned tool where it offers a drafting
   step, otherwise by hand in the shape. Never overwrite a guide someone has
   edited: put the fresh draft beside it, uncommitted, and merge by hand.
3. Fill every fill marker in plain product language, for a tester who has
   not read the records:
   - what changed, per user requirement;
   - where to test: environment, revision, build, test data, and sign-in;
   - the manual steps per user scenario, each with its expected result;
   - what the automated tests already prove, per acceptance criterion, with
     the run that proves it — never more than the evidence shows;
   - the criteria table: each criterion or scenario once, marked automated,
     via its requirement, manual, or not covered, with its results;
   - the known gaps, the assumptions taken during the work, and what is out
     of scope.
4. Commit the guide with the change, so the tester reads it in the change
   under review, and give the tester its path.
5. Record each tester result as an acceptance test result — evidence of kind
   `acceptance` against the criterion or scenario — naming the tester as a
   `USER:` source, the environment, and the revision the tester tested: the
   revision the tester names, otherwise the environment's latest recorded
   deployment. Never record the recorder's own checkout as the tested
   revision; when neither is known, ask the tester instead of recording.
6. Check the guide's currency and results through the sanctioned tool. Where
   the tester's sign-off is required, every criterion or scenario not proven
   by automated evidence needs a current acceptance pass: its latest
   acceptance test result is a pass, at the delivered revision or an ancestor
   of it, recorded at or after the guide was drafted. A failing acceptance
   test result is a finding: route it through `rdd-triage`.
7. Hand back to `rdd-completion-review` for the completion trace. The
   completion brief links the guide and shows its results beside the
   automated evidence.

Outside a slice, a missing or stale guide is disclosed in one line and does
not stop completion.

## Report

Report the guide's path and whether it is current, any fill marker still
open, the criteria split between automated, manual, and not covered, the
acceptance test results with tester, environment, and revision, the gaps, and
the handoff.
