# Slices, project gate rules and user acceptance tests

Status: decided (see Decisions); not yet normative — `PROCESS.md` and the
skills change in the next step.

Source: `USER:2026-10-13:slices-gates-uat` — "we are testing too often and
deeply in RDD-process, it's wasting time … bring concept of slice of work to
regular process … abstract out the human gates to separate
rdd-human-gates.md file … introduce another step … user-acceptance-tests",
with the customer problems below kept in mind.

## The customer problems this must solve

| # | Problem met | Where it came from |
|---|---|---|
| P1 | Work that is live in production cannot be closed: completion accepts only a merge to the default branch. | NextPath, `REQ-COURSE-001`, 2026-10-12 |
| P2 | Bookkeeping resets reviews: adding test citations moved fingerprints, staled passing reviews and asked for new approvals (six re-approvals and two extra reviews in one sprint). | Our sprint of 2026-10-09 |
| P3 | Evidence is assembled by hand: three RED commits, their runs and the GREEN run collected per requirement. | NextPath observation 3 and 8 |
| P4 | Full verification and review run per item, so a small package of related changes pays for many reviews, many full suites and many completion gates. | Process owner, this request |
| P5 | One process for everyone: a team cannot say "this kind of decision the AI may take", short of an autopilot grant with an end date. | Process owner, this request |
| P6 | The loop ends at "DONE" in the store; nobody gets a document saying what was built and how to check it by hand. Production state and process state are not shown together. | NextPath observations 6 and 7; this request |
| P7 | Preparation refuses or blocks for reasons that do not stop work. | NextPath; BACKLOG-TOOL-481/482/493/498/500/509 |

## What exists today (25d85d6)

- **Sprint** exists only in §Autopilot (`PROCESS.md:496-677`) and
  `skills/rdd-autopilot`: the period an autopilot grant covers, ended by a
  date, the human, or the scope being done. Work inside is a "connected
  journey" built in batches (one RED commit and its GREEN per batch), one
  cold-review pass per journey, full verification deferred to closeout, one
  independent review and one completion page at the end, answered item by
  item. No code knows the word; the server has no sprint record.
- **"Slice" is already used** for "the working code a batch lands"
  (`PROCESS.md:550` and nearby; `rdd-autopilot` 79, 91, 132-133).
- **The regular loop tests and reviews per item:** upper RED per UR scenario,
  lower RED per SR clause, focused and proportional gates per clause cycle,
  full verification at each phase exit, up to two cold-review rounds per Epic
  or SR, an independent code review and a completion gate per Epic. The
  server enforces the per-SR part: RED before IN_PROGRESS, a passing lower
  trace before IN_REVIEW, current evidence before completion
  (`core/rdd/reconcile.ex`).
- **Units of work:** Epic, single SR, small-change lane (with lane batches at
  completion), named sets for baselines. A work selection holds one Epic or
  one SR; nothing groups several Epics as one package.
- **Human gates** are defined in `PROCESS.md` §Gates (280-438) and the phase
  skills, and enforced in server code (`Governance.class`,
  `Lifecycle.gate_edges`, `require_approving_human_answer`). The only
  per-workspace knobs are cascade mode and lane authorizations. Every answer
  the server stores is recorded as a human's, so "the agent answers entry
  under a grant" is a convention the record cannot show.
- **The end:** completion review, delivery, reconciliation, the completion
  gate, DONE. No acceptance-test guide, no test plan for a tester, no
  release-facing summary per change. Evidence kinds include `manual` and
  `browser_verification`.

## 1. Slices

**Definition.** A slice is the set of Epics and requirements a developer is
delivering as one logical package. It has a name and members; it has no
dates. It starts when the developer opens it and ends when the developer
closes it. It may be one requirement. It replaces "sprint" everywhere, and
autopilot becomes a way of running a slice (section 2), not a separate
period.

**Iterative.** Members can be added while the slice is open. Each addition is
reviewed when it is written to the store — a review of the addition and its
effect on the slice, not a re-review of the slice.

**What happens once per slice instead of once per item**

| Activity | Today | With slices |
|---|---|---|
| Planning cold review | up to two rounds per Epic or SR | one review of the slice plan at the start; one narrow review per addition |
| Entry approval | one gate per Epic or SR | one per slice, plus one per addition — or none, by the project's gate rules |
| Red-first | upper RED per scenario, lower RED per clause, a commit pair per clause cycle | per connected batch, as autopilot does now: one RED commit with a failing assertion for every clause in the batch, then its GREEN |
| Tests while building | focused + proportional + full at phase exits | focused tests per batch only |
| Full verification | each phase exit | once, at slice end, at the delivered revision |
| Independent code review | per Epic | once per slice, over the whole change |
| Completion | one gate per Epic or SR | one page per slice, answered item by item |
| Acceptance-test guide | none | one per slice (section 3) |

**Fingerprints and staleness (P2).** Reviews and approvals pin the slice, not
each member. An edit that does not change intent — test citations, evidence
links, wording the reviewer marked as a note — does not reopen the slice's
review. An edit that changes intent reopens review for that member only, as
an addition does. This needs the review fingerprint to be separate from the
write fingerprint (the cold review of `EPIC-CLI-DELIVERY-PATH`, finding
F-DELIVERY-R1-01, showed that reusing one value for both loses writes).

**Small work keeps working.** A one-requirement slice is today's single-SR
loop with one review and one completion; the small-change lane becomes a
gate rule ("a change of class X needs no human entry") rather than a separate
lane.

**Renames.** The existing "slice" (code a batch lands) becomes **increment**.
"Sprint", "sprint end" and "the sprint's working record" become slice, slice
end and the slice record. Gap records name the slice.

**Store.** A slice is a work selection of a new kind `slice` whose members
are Epics and requirements, with one packet aggregate over them and one
entry and completion gate subject (the lane batch's per-member approve and
reject, generalised). Per-requirement evidence and traces stay as they are, so
what the server enforces per SR still holds — only its timing moves to the
slice's batches.

## 2. Project gate rules — `process/rdd-human-gates.md`

**Idea.** The process names the decision points (gates) and what each must
carry — brief, evidence, prerequisites. A project file says, per gate, who
decides: a human, or the agent under a stated rule. The kit installs a
default file equal to today's rules. Autopilot is a second preset file: the
agent decides entry and recorded assumptions, completion stays with the
human. A customer edits their copy in a pull request.

**Shape (sketch).**

```markdown
# Human gates — <project>

- **Decided:** USER:<date>:<why>

| Gate | Decided by | When the agent may decide | Always a human when |
|---|---|---|---|
| Candidate confirmation | human | — | — |
| Slice entry | agent | the slice's plan review passed with no open material finding | the change touches auth, payments, existing data or an external contract |
| Addition to an open slice | agent | its narrow review passed | as above |
| Slice completion | human | — | — |
| Demotion | human | — | — |
| Product decision during build | agent (recorded assumption) | reversible and inside the slice | as above |
```

**Honesty.** A gate the agent decides is recorded as the agent's decision,
naming the rule row that allowed it and the human whose file it is. Today the
server stamps every answer as human; it must learn an agent answerer and
check the rule. Without that, the file is advice, not enforcement.

**Store.** The file is pushed to the store as the System's gate policy with a
`USER:` source (the shape of `cascade_mode` and lane authorizations), and the
server's gate checks read it. The CLI shows the active rules at session start.

**Floors.** Some things stay outside any project file because they are not
gates of this process: merging, deploying and releasing are human acts in the
project's own tools.

## 3. User acceptance tests

**A new last step per slice.** After the slice's full verification and before
its completion page, the agent writes the **acceptance-test guide** for a
human tester:

1. What changed, in product language, per user requirement.
2. Where to test it: environment, revision, build, test data, sign-in.
3. Step-by-step manual checks per user scenario, with the expected result.
4. What the automated tests already cover, per acceptance criterion, with the
   run that proves it.
5. An acceptance-criteria table: criterion → automated / manual / not
   covered → result.
6. Known gaps, assumptions taken during the slice, and what is out of scope.

The tester's results are recorded as evidence (`manual` or a new
`acceptance` kind) against the criteria. The completion page links the guide
and shows its results next to the automated evidence, and — on a deploy path —
which revision runs where (P6).

**Store.** The guide is a slice packet section (`acceptance_guide`), so it is
versioned with the slice, reviewable and readable through the CLI;
`process complete` refuses a slice without it unless the gate rules say the
project does not use acceptance tests.

## How the customer problems land

| Problem | Answered by |
|---|---|
| P1 completion only on merge | the declared integration path (`EPIC-CLI-DELIVERY-PATH`), carried into slice completion |
| P2 bookkeeping resets reviews | slice-level pins, intent changes reviewed per member, separate review fingerprint |
| P3 hand-assembled evidence | batch REDs (one run per batch); test-report evidence (planned follow-on) |
| P4 too much testing and review | section 1: full tests, code review and completion once per slice |
| P5 one process for everyone | section 2: project gate rules, autopilot as a preset |
| P6 no tester-facing end, no production view | section 3: acceptance-test guide with deployment facts |
| P7 preparation blocks | `EPIC-CLI-DELIVERY-PATH` REQ-CROSS-551/552 |

## Order of work

1. **Process text** (req-driven-dev): slices and the renames; §Gates split
   into the process's gate definitions and the default gate rules file; the
   autopilot preset; the acceptance step and `rdd-acceptance` skill; file-state
   shapes for the slice record, the gate rules file and the guide.
2. **CLI**: slice selection and membership, slice enter/complete, showing the
   gate rules, writing and reading the guide — first working on top of
   today's per-Epic records where possible.
3. **Server**: the `slice` work-selection kind and aggregate, the gate policy
   and the agent answerer, the guide packet section and the acceptance
   evidence kind.

Each of 2 and 3 is product work and goes through the loop.

## Decisions (`USER:2026-10-13:slices-gates-uat-as-recommended`)

- **D1 — red-first inside a slice:** kept, per connected batch. Every clause
  gets a failing assertion before its code, with one RED commit and one GREEN
  commit per batch.
- **D2 — floors:** the shipped default and autopilot gate files keep slice
  completion human when the slice touches sign-in, payments, existing data or
  an external contract. A project may change that in its own copy.
- **D3 — acceptance tests and completion:** the default gate file requires the
  acceptance-test guide before completion; whether the tester's sign-off is
  also required is each project's gate-file rule (default: not required).
- **D4 — rename:** today's "slice" (the code a batch lands) becomes
  **increment**.
- **D5 — `EPIC-CLI-DELIVERY-PATH`:** built now on today's process, without
  `REQ-CROSS-553`, which is deferred to this work's separate review
  fingerprint.
