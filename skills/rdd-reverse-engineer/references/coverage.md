# Coverage and citation checks

Use these checks for the exact authorized repositories and behavior scope.
Retain the frozen inventory and persisted read-back used for each measurement.
A narrow request is measured over that scope; a full sweep must include every
authorized context. Do not shrink a denominator to make a result pass.

## Citation validity

Use `rdd-audit` and its supplied `audit-citations.mjs` for citations in recovered
local documents. It checks path/locator resolution and a minimum recognized
citation **count** (`--min=N`). It does not enforce percentage coverage. Historical
source availability is checked through the sanctioned immutable source reader;
store citations and links use the store's typed contract, not a retired ledger scan.

Unresolved or ambiguous citations fail this check. Zero recognized citations over
nonempty expected input is a failed measurement, not 100% coverage. Report a
missing local-document corpus as not applicable when only store records are in
scope; still validate their captured identities and links.

## Extraction and source coverage

Keep a separate rerunnable coverage checker with the run's staging artifacts.
Reuse one that measures these inputs correctly; otherwise write a scoped checker
from the frozen inventory and authoritative read-back. This is an audit artifact,
not a product test or another requirement store. In ModernPath,
`reverse-engineer coverage --run ID` supplies source/trace coverage; it does not
enumerate behavior classes or enforce the extraction floors below.

Record stable unit identities and mappings so the checker can report:

| Measurement | Denominator | Numerator / required result |
|---|---|---|
| Behavior extraction, per applicable class and repository/context | Enumerated in-scope behavior units | Units mapped to grounded persisted requirements; at least 90% in each applicable class |
| Source disposition, per repository | Eligible inventory files after documented exclusions | Distinct files cited by persisted rows or explicitly dispositioned with a reason; at least 60% |
| Governed and candidate linkage | The same inventory and mappings | Separate counts for confirmed links, candidate links and their overlap; no invented promotion |
| Reverse mapping | Every persisted requirement/source reference in the batch | Resolve inside authorized inventory or to an explicitly authorized existing identity |

Behavior classes include the applicable routes/RPCs, jobs/events/webhooks,
CLI/agent tools, data behavior, access controls, client flows and integrations
identified during derivation. State genuinely absent classes as inapplicable;
an unexplored class is not absent. A file disposition does not establish behavior
coverage, a candidate link does not establish governed coverage, and neither
establishes executed or verified behavior. Count each unit once within its class.

Make this separate checker exit nonzero when a floor is missed, an applicable
denominator is missing/unmeasured, a mapping cannot resolve, or its inputs do not
match the authorized inventory/read-back. Unknown or partial input is incomplete.
Validate the checker with a deliberately missing mapping before trusting its
passing result, then restore the input. Keep its command, verbatim output and
exit code. A successful citation audit cannot substitute for this result.

Run comparable measurements before and after publication. Report N/N for each
class and repository/context, exclusions, unresolved references and uncovered
units; rank uncovered directories and untraced tests to guide remaining work.
Target complete coverage and preserve meaningful requirement granularity; the
floors and a row count are not permission to truncate an authorized full sweep.
