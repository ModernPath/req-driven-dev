# Recover observed design

Read when the adoption request includes system design documentation. Reuse or
extend maintained documents rather than creating a competing numbered corpus.
The following are output topics, not mandatory filenames or new normative rules.

| Topic | Record |
|---|---|
| Architecture | Subsystems, external interfaces, stores, and an end-to-end request path |
| Deployment | Runtime units, boundaries and published interfaces; fold into architecture for a simple stack |
| Integrations | Direction, protocol, enforcement point and observed failure handling, or an explicit question |
| Cross-cutting behavior | Auth, tenancy, secrets, observability and resilience as implemented |
| Data flow | Origins, transformations, destinations and trust-boundary crossings |

Inspect existing guides as context, then cite code/configuration for observed
claims. Preserve intended-versus-deployed differences. Do not author a guide and
then cite it as independent authority for the inference it just introduced.
Update the existing document index with scope and observed/proposed/current
status so recovered descriptions are not mistaken for approved policy.

When ADRs are useful, mark recovered decisions `observed`, never `accepted`
without attributable authority. Reconcile by existing id/slug on subsequent
passes. Record uncertainty and alternatives as observations, not ratification.

Sweep quality attributes and latent thresholds: timeouts, pool sizes, retries,
rate limits, cache TTLs, payload caps and similar settings. First check existing
records to avoid duplicating behavior under an NFR label. Unknown intent remains
a question attached to a DERIVED behavioral candidate or PROPOSED engineering
constraint as appropriate. A configured value is not a measured limit or a
human-approved target.

Do not manufacture performance measurements or threat-model decisions from
configuration. Record enforcement and failure paths with direct sources. Audit
citations, compare inventories both ways, and preserve gaps explicitly. On a
later context pass, reconcile newly observed facts without rewriting confirmed
requirements or silently changing policy.
