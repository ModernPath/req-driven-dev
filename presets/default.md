# Project gate rules

- **Decided:** kit-default
- **Preset:** default

| Decision | Decided by | When the agent may decide | Always a human when |
|---|---|---|---|
| entry | human | — | — |
| slice_addition | human | — | — |
| small_change_entry | agent | lane_authorization_current | sign_in payments existing_data external_contract |
| pre_approved_entry | human | — | — |
| defect_fix | human | — | — |
| incident_fix | human | — | — |
| product_assumption | human | — | — |
| completion | human | — | — |
| candidate_confirmation | human | — | — |
| demotion | human | — | — |
| acceptance_guide | required | — | — |
| tester_signoff | not_required | — | — |
| baseline_acceptance | human | — | — |
| gate_rules | human | — | — |
| lane_authorization | human | — | — |
