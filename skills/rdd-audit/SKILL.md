---
name: rdd-audit
description: Check document claims, source citations, and inventory completeness against direct evidence. Use within reverse-engineering, planning review, or completion review, or for an explicitly requested document audit. Reports verified findings and measurement limits; does not assign lifecycle state or authorize changes.
---

# Audit claims and citations

Read the project `AGENTS.md` and canonical `PROCESS.md`. This is a shared
utility, not a delivery phase. The invoking pass owns scope and routes findings
through `rdd-triage`. An audit request alone does not authorize document or
implementation changes.

## Establish the scope

Identify the documents, source repositories, revisions, and claims being checked.
Use the project's actual document locations. Separate intended behavior from
claims about implemented behavior: code can establish the latter but cannot
silently replace approved intent.

In a store-backed project, use its sanctioned tool for authoritative records,
typed citations, inventory projections, and immutable source reads. Do not infer
the requirement corpus from local snapshots or recreate retired task ledgers.

For each inventory, state what one item is, how it was enumerated, and which
items are excluded with reasons. Compare both directions: entries lacking
support and relevant source items absent from the inventory. Account for each
item as covered, excluded with a reason, or unresolved. A disclosed unresolved
gap remains a gap. Counts and percentages describe that population; they do not
prove semantic coverage or authorize a lifecycle transition.

## Check citations

Use `audit-citations.mjs` beside this skill for local Markdown citations. Pass
the actual document roots and source repositories explicitly. Substitute the
paths and repository keys in this command:

```text
node <skill-directory>/audit-citations.mjs <document-root> --repository=<key>=<source-root>
```

Repeat `--repository` for multiple repositories. Git worktrees and explicitly
declared non-Git roots are supported. A qualified reference has the form
`CODE:repository@revision:exact/path:locator` or `TEST:` with the same structure.
Qualified revisions must match the declared checkout. Use the sanctioned source
reader when checking captured historical bytes.

The checker handles file existence, unique path resolution, numeric line
locators, simple symbol-name occurrences, and Markdown `DOC:` references. It
does not establish that the cited code supports the claim or that a named test
executed. Composite test identities require the test runner or the store's test
identity contract; an unsupported locator is reported, never shortened to a
passing parent name.

Describe missing artifacts as gaps in prose. Do not prefix an absent path with
`CODE:` or `TEST:` as though it were supporting evidence. Nearby words such as
“no” or “missing” do not exempt a citation from checking.

Teaching examples may use the per-line `<!-- example-citation -->` marker or
an `example-citation` fenced block. Those references are reported as skipped,
never included in the checked denominator. Prompt directories are guarded by
the checker; use `--force-prompts` only for an intentional review of their
examples and real references.

The checker exits non-zero for broken, ambiguous, unsupported, or elided
references, or when fewer than `--min=N` citations were checked. The default
minimum is one; `--min` is a citation-count guard against an empty or incomplete
scan, not an extraction-coverage threshold. Establish an expected citation count
independently before using a higher minimum.

## Verify meaning and measurement

Open each suspected defect and check the full relevant expression, declaration,
caller, and document context before reporting it. Distinguish a documented
exclusion or intended future behavior from an incorrect claim of current behavior.

Check claims about complete sets against an independently enumerated population.
Account for removals, renames, disabled code, nested route prefixes, and other
language-specific constructs where they affect that population. Verify named
references in addition to counts; equal counts can describe different sets.

Validate a new or changed checker against both known-good and known-bad inputs.
Check exit status, selected inputs, and actual output. Neither a high failure
rate nor a clean first run establishes whether the checker is correct. Keep
uninspected detector hits separate from confirmed findings.

Compare related documents to locate disagreements, then resolve factual claims
against authoritative sources. Agreement among several documents does not make
their claim authoritative. Do not resolve conflicting intent by majority or
timestamp.

For published copies, use the sanctioned publication/read-back route and compare
content or digests at the relevant revision. Content length alone cannot establish
equality. Check applicable runbook commands, configuration, document links, and
indexes against their actual targets.

## Report

Report the inspected scope and revisions, inventory units and counts, checked
citations, confirmed findings with direct sources, exclusions, and unresolved
or unsupported checks. State what was checked and held as well as what failed.
Preserve command output and exit codes for measurements used by a gate.

Route findings through the invoking pass and the sanctioned process store when
they affect process records. A report does not itself change a requirement,
resolve a gap, approve a decision, or waive missing evidence. Recheck affected
claims after an authorized correction; change documents only within that scope.
