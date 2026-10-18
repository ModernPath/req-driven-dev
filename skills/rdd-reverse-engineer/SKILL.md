---
name: rdd-reverse-engineer
description: Derive and publish source-scoped requirements from existing code and documentation as an authorized baseline or DERIVED proposals. Use for initial adoption or additional reverse-engineering; evidence review uses the ordinary Epic completion process.
---

# Reverse-engineer a requirement base

## Purpose

Establish grounded user requirements (URs), system requirements (SRs), and
their source relationships within the agreed scope. Baseline publication
creates PENDING_VERIFICATION requirements in Base. DERIVED publication creates
proposals that remain separate from the confirmed corpus. Neither mode records
test PASS, compliance approval, delivery entry, nor completion. Do not change
product or test code, and do not execute untrusted repository code in this pass.

## Read first

Read the project's `AGENTS.md` and canonical `PROCESS.md`. In ModernPath, also
read the installed `mp-process-cli` skill and `.modernpath/cli-reference.md`
for the sanctioned onboarding and command contracts. Establish the target
system, requested behavior and context scope, repository roots, and relevant
documents. Read the authoritative requirement corpus; an empty local export
does not establish an empty system. Prefer fresh local documents and use live
reads only when material is missing, stale, or authoritative confirmation is
needed.

Use the sanctioned process interface for authorization, capture, publication,
and read-back. If it lacks a required operation, report a tooling gap through
the project's named channel. Do not create a local ledger or call the store
transport directly.

## Authorize and capture

Inventory whole repositories or whole directories that contain the context's
flows. Include entry points, handlers, event producers and consumers, shared
libraries, tests, configuration, and deployment behavior. Exclude credentials
and private workspace metadata; report generated, vendor, secret, and
unsupported exclusions. Record repository revision and dirty state separately
from the captured bytes. For every captured file retain its native SourceFile
UUID, exact path, size, and digest. For a system document use its native bigint
ID, authorized revision, and content digest. These digests establish source
integrity; they are not authorization or approval tokens.

When resuming, read the existing authorization, captured sources and published
records before collecting or publishing again. Reuse unchanged authorization
and native run/group identities; read back an uncertain write before retrying.
A changed source scope needs fresh authorization. A supported group must not
collide with named existing records; unrelated corpus changes do not justify
rewriting them.

Present the corpus, source scope, inventory, and the two publication modes.
Obtain explicit authorization for one mode and the scope:

- **Baseline:** publish grounded as-built requirements to Base in
  PENDING_VERIFICATION.
- **DERIVED:** publish proposals separately while preserving governed content.

Recommend baseline for an empty corpus or when the person asks for an as-built
base; otherwise recommend DERIVED. The person's answer is the authorization
source. An earlier explicit authorization remains valid for unchanged scope;
do not ask the same question again. Record whether the person chose to continue
autonomously through the authorized run or to confirm each publication group.
Do not broaden scope without fresh authorization.

Authorization creates a native UUID run and captures the authorized source
snapshot. For ModernPath, repository descriptors and document descriptors
must match the installed CLI contract. Preserve the captured bytes and
integrity digests. Never substitute current source for an unavailable
historical capture.

## Batch sweep

A full sweep of a system with several bounded contexts runs as a batch: the
contexts are derived at the same time by delegated context workers, while one
orchestrating session runs the whole sweep, follows every worker and makes
every write. A worker derives and stages; it never writes to the process
store. A batch has a setup, the workers, the independent reads and a merge.

**Setup, by the orchestrating session.**

1. Inventory every repository, read preflight and ask the authorization question
   once for the whole batch: the mode, the run mode, the documents and
   the bounded contexts, each context with a code, a name and its scope — the
   whole repositories and directories its flows pass through. The person's
   answer is the batch authorization, recorded as the authorization source of
   every run, and it is the decision to leave a context unfinished for the
   reasons below. Confirmed contexts go to the sweep's confirmed-contexts file,
   so the question is not asked again.
2. Name the owner of every shared mechanism: a mechanism several contexts use,
   such as sign-in, payment authorization, notifications or a shared client
   library, has its SRs in one owning context. The other contexts do not write
   their own SRs for it; they record which of their URs the owner's SRs serve.
   Name the owner of every repository and directory too: a context's scope
   takes whole repositories, so several runs capture the same files, and each
   file is read and assessed by the context that owns it. A repository laid
   out by layer, such as models, services and controllers, has no directory
   a feature context owns: assign its files to owners by what they implement,
   and give its shared plumbing one owner. Every file that more than one run
   captures has an owner in the batch plan before a worker starts, so the
   other runs assess it in the ownership form instead of reading it again.
3. Authorize and capture one run per context. An authorization records a run
   and changes no requirement, so the runs are authorized back to back; when
   one is refused as stale, read preflight again.
4. Write the batch plan to `batch-plan.md` in the sweep's working folder: each
   context's native run UUID, scope, the repositories and directories it
   owns, and the shared mechanisms it owns and uses. Every worker reads it
   first.
5. Write each context's brief to `<run folder>/brief.md`: the rules a worker
   applies on every file and requirement, in the context's own terms, and the
   exact commands it runs with this run's values filled in — reading the
   captured source, the content check with its existing parents and owned
   repositories, and the staging shape. A worker reads the brief instead of
   this skill, so it carries the reason forms, the finish condition and the
   content checks, and names the step of this skill for anything else.

**Context workers, in parallel.** The orchestrating session delegates each
context to context workers, as many at once as the model's rate limit
allows, and the next as one returns. A context is split into slices, each one
worker's assignment: a group of files the context owns that implement related
behavior, such as a controller with its service, models and tests, small
enough that the worker reads all of it with room left for writing. A worker
ends with its slice; the next slice, or the remainder of a partial one, goes
to a new worker that starts from the run folder. A long-running worker
carries every file it has read into each later step, so it costs more with
every step and is the first to hit a rate limit. A worker
takes the [context worker role](references/context-worker.md), which the
orchestrating session hands it with the assignment, through the harness's
installed agent definition where there is one. A worker
follows [Recover and derive behavior](#recover-and-derive-behavior) and the
staging part of [Publish native records](#publish-native-records) for its
slice: it reads the code, writes the requirements, stages them in its run folder,
runs the offline content check, reads a sample against the code, and hands
back a handoff naming what is ready, what remains, the accounting of its
surface units, entry points and files out of their totals, and the writes it
needs. It writes only in its run folder and never runs a store write, even
where a step names one.

The orchestrating session follows the workers by their handoffs, not by
polling run status, and reads each handoff when it arrives and acts on it:

- **Partial:** the worker returned before its slice was accounted for.
  Start a new worker with the remainder the handoff lists.
  A returned worker is not a finished context. Name the remainder by owner:
  the files of the context's own repositories and directories are read and
  linked or given a reason of their own; files another context owns are
  assessed by ownership. A continuation never tells a worker to leave files
  unresolved, and never supplies the wording of a reason.
- **Ready:** publish the staged groups, read them back, compare them with the
  staged files, and make the authorized writes the handoff names. Report a
  refused publish with its exact refusal. A permission,
  authentication or process-tool refusal stops the affected work; it is never
  retried by rewriting or splitting the refused action.

A context never waits for another and never stops the batch. It ends finished,
or unfinished with its remaining gaps in its report: an edit the installed
tooling cannot make, a question only a person can answer, a fact in a
repository outside its scope, or the independent read still to come. The
batch authorization covers leaving a context unfinished for these reasons, so
the orchestrating session states the gaps and moves on without asking. Work a
worker can still do is never such a gap. The stop list of the `mp-process-cli`
onboarding stops the context it concerns; it stops the batch only when it
concerns the whole system, such as the service or the sign-in.

Without delegated agents, each worker runs as its own session that stages but
does not publish, and the orchestrating session publishes its handoff.

**Independent reads, in parallel.** When a context has published, an
independent reviewer that wrote none of it reads its sample
([coverage](references/coverage.md#content-quality)). The reads of different
contexts run at the same time. The orchestrating session records the
verdicts and sends the findings to a worker for the context, whose corrected
drafts and named writes it then applies. A finding marked fixed by the session
or worker that made the correction is not a verdict: the corrected context
gets a new independent read, of a new sample that includes the corrected
records, before it can be reported finished.

**Merge, by the orchestrating session,** after every context has reported:

- link each shared SR to the URs of other contexts that it serves, as the
  handoffs record them, now that both records exist;
- compare the new requirements across contexts by outcome and behavior, and
  list the duplicates with a proposed disposition for the person;
- combine the contexts' open questions into the sweep's open-questions file;
- write the batch summary: for every context its status, its counts, its
  content check results, its entry points covered out of total, its
  independent-read verdicts, and the open questions that need the person.

## Recover and derive behavior

Within each slice, inspect schemas and migrations, actor surfaces, behavior
and refusal paths, relevant design sources, tests, and
configuration. Enumerate routes, RPCs, jobs, events, webhooks, CLI/agent
surfaces, models, access controls, client flows, integrations, and tests. Mark
absent classes inapplicable only after checking; unresolved surfaces remain
gaps.

Write each UR as one outcome an actor would start independently and notice if
it broke. Trace the real caller and state the behavior within the captured
boundary. Include implemented variants, refusals, limits, units, and outbound
effects. A guard is a scenario or criterion, not its own UR. A cross-layer
outcome is one UR served by each needed SR. Each SR describes one boundary and
behavior with meaningful, testable criteria. State as-built behavior even when
it differs from evident intent; record intent questions separately.

Derive from code and documents actually read. A test reference identifies an
assertion; it does not establish execution. Distinguish production code from
test-only behavior, and do not claim rules outside the captured scope. Shared
mechanisms have one owning SR linked to every UR they serve. Do not infer
relationships from prose alone.

Before publication, account for every in-scope file and actor-facing surface:
linked to a grounded requirement, already covered by a named requirement,
excluded with a checked reason, or unresolved. Report entry points covered out
of total, outcomes per UR, uncovered code and tests, and all exclusions. A few
broad requirements citing every file do not establish behavioral coverage.
A script may enumerate, group and measure the inventory; it never writes
requirement titles, statements, actors, outcomes or scenarios from identifiers
or test names. UI controls are steps within an outcome, not standalone URs.
Keep live code distinct from retired or unreachable behavior, and state client
or platform differences explicitly. Work a requested full sweep to the end of
its inventory; a target count is neither a quota to fill nor a cap.

Read each proposed row against its implementation and tests; correct generic,
duplicated, templated, fragmented, or inaccurate statements before publishing.

Before publication, run the [content quality checks](references/coverage.md#content-quality)
on each complete group, validate mechanical checks against known-bad inputs,
and read the staged sample against code. After publication, repeat the checks
on persisted records. The independent read required by that reference remains
a finish condition; an author's correction alone is not its verdict.

## Publish native records

Prepare coherent groups before publishing. Compare proposed outcomes and
behavior with the existing corpus. Reuse existing content only by its native
identity and kind; do not change existing content as a side effect of
publication. Use native UUIDs for new requirements, criteria, authorization
runs, and publication groups. Use native bigint IDs for system documents and
Epics. Do not encode identities in strings, prefixes, aliases, or external-ID
fields.

Represent relationships as explicit typed Traces at group level. Endpoints
must use the endpoint type's native identity: UUID fields for UUID-backed
records, integer ID fields for bigint-backed records. Link URs to serving SRs,
and requirements to the captured code, tests, and documents that support them.
For captured code and tests, trace to the actual SourceFile UUID and preserve
path/revision/digest in the capture. For system documents, trace to the native
document type and bigint ID. Only publish traces within the authorized run's
captured or explicitly authorized source scope.

For ModernPath, send `requirements` and group-level `traces` using the current
native publisher contract. New requirements include their UUID `id`, complete
`kind`, content, criteria and applicable baseline/DERIVED state. Existing
requirements may be referenced by `{id, kind}` without resubmitting content.
Each trace supplies typed source and target entity kinds and exactly one
appropriate native endpoint ID per side. The group UUID is supplied as the
publication operation's group argument. Do not add per-requirement citation
arrays, parent ID arrays, operation keys, or approval fingerprints.

Baseline rows become PENDING_VERIFICATION in Base; this is authority for the
as-built statement, not verification. DERIVED rows remain proposals pending
ordinary planning and human Epic approval. If the sanctioned interface offers
a native candidate preview or decision for DERIVED proposals, use that exact
contract and preserve the distinction from baseline; do not invent a separate
gate, receipt, or key protocol. If the contract cannot express the required
decision, report the gap.

Read back the published records from the authoritative interface. Check native
IDs and kinds, lifecycle/state, criteria, and each intended typed Trace. Count
created, reused, proposed, rejected, and unresolved records separately. Report
partial publication and the exact remaining scope. A read-back confirms what
was recorded; it does not establish behavior or test execution.

## Outputs and next step

Report the authorized scope and mode, native run and published IDs, source
capture integrity, coverage denominators, content review, read-back results,
and gaps or unpublished work. A run is complete only when every in-scope file
and surface has a checked disposition and the requested coverage review is
complete; see [coverage checks](references/coverage.md).

For a published baseline, existing-behavior evidence is reviewed through the
ordinary requirement and Epic lifecycle. Use `rdd-verify` for required
execution evidence and `rdd-completion-review` for the selected Epic's normal
human completion approval. Do not promote baseline requirements directly to
DONE through a reverse-engineering-specific acceptance path. Missing tests or
changed behavior require normal scoped planning and development.

For a full-system adoption or requested design-document output, use
[recovered documents](references/recovered-documents.md). A narrow run updates
only relevant existing documents and reports out-of-scope areas.
