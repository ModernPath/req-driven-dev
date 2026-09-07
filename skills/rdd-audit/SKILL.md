---
name: rdd-audit
description: Check document and record claims against code, resolve citations, compare inventories in both directions, and validate measurement coverage. Use from cold review, completion review, or adoption, or for an explicitly requested document/instrument audit. Produces sourced findings without assigning lifecycle state or granting approval.
---

# Audit document and record claims

Read the project `AGENTS.md` and canonical `PROCESS.md`. This shared utility
establishes facts; its invoking pass owns the gate and routes corrections through
`rdd-triage`. Limit routine reviews to the affected surface. A whole-corpus sweep
requires an adoption/release scope or an explicit audit request.

## Execution contract

- Input: named document/record set, claim type, affected repository revision,
  authoritative sources, and explicit inventory populations; no lifecycle change
  is implied by invoking this utility.
- Writes: sourced findings, measurement output, limitations, and a durable
  handoff to the caller; do not silently correct normative intent or product code.
- Exit: checked claims and exact unresolved/unsupported findings. A tool failure
  or zero checked population cannot satisfy the invoking gate.

## Procedure

1. Distinguish intended behavior from descriptions of existing code. Missing code
   support is relevant to an as-built claim; it does not disprove a normative
   requirement. Record the audit's scope, revision, and excluded populations.
2. Run the shipped citation auditor from the target repository root, using the
   installed skill path (or this repository's `skills/rdd-audit/` path):

   ```bash
   node .modernpath/rdd/skills/rdd-audit/audit-citations.mjs docs tasks
   ```

   Inspect recognized, checked, unresolved, unsupported, and exempt counts.
   Canonical `CODE:`, `TEST:`, `DOC:` and supported bare references are structural
   checks, not proof of behavior. Read unsupported forms and use a suitable
   resolver or correct the citation; never count them as checked. Zero checked
   citations requires an explicit scope/groundedness finding, not a passing trace.
3. Open cited sources and compare them to the claims. Stable test-name presence
   does not prove registration, execution, production reachability, or the cited
   assertion; `rdd-verify` establishes those when behavioral evidence is required.
4. Enumerate the actual population an inventory claims to cover, then compare
   both directions: documented-but-absent and present-but-undocumented. Account
   for route prefixes, disabled/commented code, drops/renames, and stated
   exclusions. Report each direction and population separately.
5. Check applicable status tags, ids/relations, sibling documents, runbook
   commands/ports, and index entries. For an authorized synchronized corpus,
   compare the published copy too. Do not trigger publication merely to audit it.
6. Challenge the instrument with known-good and known-broken inputs. Investigate
   suspiciously complete passes, high failure rates, and unexpected count changes;
   neither direction proves that the checker or corpus is right. Inspect every
   candidate finding before reporting it as a defect.
7. Record what held, what failed, direct sources, population denominators,
   unchecked claims, and the exact next action. The caller imports findings into
   its gate or routes them through triage. A finding's substance must be durable,
   not only a pointer to disposable review notes.

## Citation tool boundary

The checker resolves paths and line ranges, document headings, and supported
symbol/test names. Named references establish lexical presence only, including
the components of hierarchical test names; test runners must establish their
actual identity and execution. Quoted test names support spaces, including names
declared in static backtick strings; interpolated templates are not static names.
A parsed name must end at a citation boundary, not an unsupported suffix such as
`[Case]`; quote the whole name when punctuation is part of its identity.
Unsupported syntax is reported, not skipped. Examples explicitly marked
`example-citation` and named gaps are exemptions, never successful checks.

Exit 0 means at least one reference was checked and all recognized references
were resolved or explicitly exempted. Exit 1 reports broken/elided references;
exit 2 reports unsupported inputs, no checks, or setup/usage problems. Read the
whole output and any exemptions before using a successful exit as narrow
structural evidence.

## Supporting examples

For surprising checker results, matcher changes, or a substantial corpus audit,
read [audit-examples.md](references/audit-examples.md). It preserves worked cases
on false passes, population mismatches, bidirectional inventories, runbooks,
published copies, and misleading counts. These examples support the checklist;
they do not impose a full-corpus audit on every development iteration.
