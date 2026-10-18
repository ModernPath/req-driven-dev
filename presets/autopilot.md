# Project gate rules

- **Decided:** USER:<date>:<why>
- **Preset:** autopilot
- **Scope:** <Epic ids, or delete this line for the whole System>
- **Expires:** <YYYY-MM-DD>

| Decision | Decided by | When the agent may decide | Always a human when |
|---|---|---|---|
| entry | agent | plan_review_passed | sign_in payments existing_data external_contract |
| slice_addition | agent | narrow_review_passed | sign_in payments existing_data external_contract |
| small_change_entry | agent | lane_authorization_current | sign_in payments existing_data external_contract |
| pre_approved_entry | agent | user_source_names_scope | sign_in payments existing_data external_contract |
| defect_fix | agent | failing_test_reproduces | sign_in payments existing_data external_contract |
| incident_fix | agent | incident_declared | sign_in payments existing_data |
| product_assumption | agent | reversible_inside_scope | sign_in payments existing_data external_contract |
| completion | human | — | — |
| candidate_confirmation | human | — | — |
| demotion | human | — | — |
| acceptance_guide | required | — | — |
| tester_signoff | not_required | — | — |
| baseline_acceptance | human | — | — |
| gate_rules | human | — | — |
| lane_authorization | human | — | — |
