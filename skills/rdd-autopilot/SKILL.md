---
name: rdd-autopilot
description: Run a slice on autopilot to build a larger scope — Epics, an initiative, or a greenfield system — under a human's autopilot grant, keeping requirements, sources, and red-first tests while moving human approval to the end of the slice. Use when a current autopilot grant covers the scope, or when the human asks to start one. Builds connected user journeys in batches before hardening, asks product questions without waiting on them, clears or logs process refusals instead of stopping, and ends the slice with full verification, one independent review, and one completion page.
---

# Run a slice on autopilot

Read the project `AGENTS.md` and canonical `PROCESS.md`
(`.modernpath/rdd/PROCESS.md` in a consuming repository), especially
§Autopilot. `PROCESS.md` owns the rules; this skill owns the order. The phase
skills still describe how each pass is done. Where their stops and round
bounds differ from §Autopilot, §Autopilot applies.

## Start

1. **Find the grant.** The grant is the autopilot preset merged into the
   project's gate rules, `process/rdd-human-gates.md`, with the human's
   `Decided:` source, `Scope`, and `Expires` (`PROCESS.md` §Project gate
   rules). Read it and check that it is current and covers the scope.
   Without one, ask the human for it in one message that names:
   - the slice, or the scope to open one for;
   - the grant's end date (the slice itself has no dates);
   - any excluded areas;
   - what the human gives up: writing each entry decision and waiting on
     questions — each entry answer the agent prepares is confirmed with one
     keystroke at the ask;
   - what the human keeps: the completion answer at slice end, and merges.

   The human merges the filled preset; §Autopilot says what it grants.
2. **Run `rdd-start`'s preflight, without stopping on it.** Clear each
   preflight fact with its documented verb: reconcile, refresh, or release a
   selection this slice does not need. If a fact will not clear, log it and
   go on. Only a missing or unreachable store stops the slice.
3. **Map usable coverage.** Turn the scope into user journeys and the views
   and primary actions each needs, linked to the requirements they need,
   existing or newly written with sources. Start the coverage matrix
   §Autopilot describes as the slice's working view, and keep it in the
   slice's working record between sessions; it links the records and is not
   a second ledger.
4. **Order the journeys.** Dependencies first, then the journey that makes
   the most of the product usable. Show the order and the first outcome a
   user will be able to reach in one message, and start.

## Loop, per connected journey

1. **Plan once.** Write or complete the journey's requirements with their
   sources (`rdd-plan`): shared reconnaissance, state and safety boundaries,
   and a RED strategy that names the representative journey and
   state-boundary assertions and the clause assertions each batch carries.
   Carry every selected requirement and clause;
   the build stages are an order of work, not new acceptance criteria. Stop
   preparing when the builder has what §Autopilot's readiness row names. An
   already-reviewed, unchanged packet goes straight to step 3, or to step 4
   when its entry is already applied and current.
2. **Review alongside the build.** Run one cold review from an independent
   context (`rdd-cold-review`), and record its findings. Reversible local
   build-ahead may start while it runs: uncommitted, set aside before the RED
   commit, and no RED evidence or status change before entry.
   - Fold each material finding about the change into the packet as a test
     or a boundary line, and resolve it as a packet edit.
   - Log the rest.
   - If the review failed, ask the same independent context for one narrow
     confirmation that the folded findings close it, and record that verdict.
   - If it still fails, log it and build the item ahead of its record.
   - No further rounds.
   - Repair a material safety finding before the affected code is committed
     past its RED commit.
   - Review again any change in a blocking cold-review category —
     correctness, security, data integrity or data loss, contract,
     traceability, testability — and any changed scope or acceptance, and
     only that change.
3. **Enter.** Prepare the entry answer under the rules file's `entry` row,
   citing the grant's `USER:` source with the disclosure `decided by the
   agent under process/rdd-human-gates.md row entry`; the person confirms it
   at the ask. Then apply it. A change that touches an always-human area
   waits for the person's own decision.
4. **Build the journey in connected batches** (`rdd-build`, with
   §Autopilot's batch cadence):
   - write the batch's representative failing tests, with a failing
     assertion for every clause the batch implements, commit them, and record
     their RED evidence at that commit. A RED commit carries only failing
     tests that its next commit turns green; that commit lands the whole
     batch. To land a batch SR by SR, use one RED/GREEN pair per SR. Write a
     journey assertion in the batch that can make it pass;
   - implement the adjacent primary actions together, keeping security,
     authorization, tenant isolation, and data integrity in this first increment;
   - run one focused integrated GREEN check, plus targeted regressions where
     the integration needs them — not the full verifier;
   - commit and push the working batch. The full-verifier rule governs your
     own feedback runs; the project's commit gate runs on every commit as
     configured, even when it runs the full suite. Never skip, disable, or
     leave a test failing to get a commit past it, other than the declared
     RED tests of a RED commit as the gate admits them. Never merge.
   Work stages 1 and 2 in order per journey: connect, then complete end to
   end. Stage 3, harden, runs at closeout.
   Record RED, GREEN, and limits as you go. Advance a requirement to
   `IN_REVIEW` only with its full required evidence; a requirement in a
   partial increment keeps its state.
5. **Checkpoint.** Reconcile the batch's records. Update the coverage matrix
   and compare it with the previous checkpoint, as §Autopilot's checkpoint
   rule says. Queue findings that do not block the journey with an owner and
   a next action.
6. Go to the next missing journey step without waiting. Hardening waits for
   closeout.

## When something refuses

1. Read the refusal. Run the verb it names, or the one `mp-process-cli` (or
   the project's store guide) lists for it, **once**.
2. If it still refuses:
   - file a gap record naming the slice, the item, the refusal text, and
     what was tried;
   - if the code is ready, keep building it on the branch ahead of its record;
   - move to the next item.
3. Never write the store by hand, never retry the same refused call in a
   loop, and never widen a grant's scope to get past a refusal.

## When a product question comes up

1. Ask it in one plain sentence, with the options and what each changes.
2. If a wrong guess is hard to undo (existing data, security, money, outside
   contracts), park that item and build others until the human answers.
3. Otherwise record the most reasonable default in the Epic's decisions as
   *assumed under autopilot, pending confirmation*, and continue.
4. When the human answers later, apply it. A changed assumption is triaged:
   fix it now if the item is still being built, otherwise queue it for the
   next slice.

## Slice end

Run it at the grant's end date, when the scope is built, or when the human
asks.

1. **Reconcile** every record the slice touched. Try once more to clear the
   logged refusals.
2. **Close out.** Run the full required verification — the slice's one full
   verification, carried to the delivered revision by containment
   (`PROCESS.md` §Slices) — and harden the
   combined change (stage 3). Closeout adds verification and hardening, not
   RED for clauses already built; a clause first built at closeout gets its
   own RED like any other. The checkpoint limit on further work on a
   green increment does not apply here. Repair what fails
   before presenting any item as eligible for completion. The end date is not
   evidence.
3. **Review.** Run one independent review of everything the slice built, from
   the code at the branch head, against its requirements and tests
   (`rdd-completion-review`'s audit). Record the findings. Then write the
   acceptance test guide (`rdd-acceptance`) where `rdd-completion-review`
   places it.
4. **Present one page:**
   - the journeys and primary actions a user can now complete, with evidence;
   - the coverage matrix: remaining clauses, and what is not built and why;
   - assumed decisions to confirm;
   - the log;
   - review findings;
   - the acceptance test guide and its results.

   Give links to the working-set files.
5. **Apply** the human's completion answers item by item. A rejected item
   stays `IN_REVIEW`. A changed assumption goes to `rdd-triage`.
6. **Report** whether the grant continues into another slice, or ends.

## Report

At each checkpoint, lead with what a user can now do, the next missing step,
and any safety or external hold, then the observed split between building and
preparation or checking. Requirement ids, RED and GREEN commits, and
assumptions follow as evidence; test and record counts are never reported as
product progress. At slice end, the page above.
