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

Present the corpus, source scope, inventory, and the two publication modes.
Obtain explicit authorization for one mode and the scope:

- **Baseline:** publish grounded as-built requirements to Base in
  PENDING_VERIFICATION.
- **DERIVED:** publish proposals separately while preserving governed content.

Recommend baseline for an empty corpus or when the person asks for an as-built
base; otherwise recommend DERIVED. The person's answer is the authorization
source. Do not broaden scope without fresh authorization.

Authorization creates a native UUID run and captures the authorized source
snapshot. For ModernPath, repository descriptors and document descriptors
must match the installed CLI contract. Preserve the captured bytes and
integrity digests. Never substitute current source for an unavailable
historical capture.

## Recover and derive behavior

Work one bounded context at a time. Inspect schemas and migrations, actor
surfaces, behavior and refusal paths, relevant design sources, tests, and
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
Read each proposed row against its implementation and tests; correct generic,
duplicated, templated, fragmented, or inaccurate statements before publishing.

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
