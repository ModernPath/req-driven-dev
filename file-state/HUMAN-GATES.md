# Gate rules file

> Canonical shape of a project's gate rules. `PROCESS.md` §Project gate rules
> defines the decision points and what each must carry; this file says who
> decides each one. It is a tracked project file at
> `process/rdd-human-gates.md`, versioned in the repository and changed the
> way the project reviews any other repository change, in a store-backed and a
> file-backed repository alike. It is not a store record.

Installation seeds the file once from `presets/default.md` and never
overwrites it; a deleted file is seeded again. `presets/autopilot.md` is the
autopilot preset a process owner copies in to grant autopilot.

```markdown
# Project gate rules

- **Decided:** <USER: source of the process owner who merged this file>
- **Preset:** default | autopilot | custom
- **Scope:** <Epic or requirement ids, comma-separated; omit the line for the whole System>
- **Expires:** <YYYY-MM-DD; omit the line when no row needs it>

| Decision | Decided by | When the agent may decide | Always a human when |
|---|---|---|---|
| <row> | <decider> | <condition, or —> | <areas separated by spaces, or —> |
```

## Header lines

- **Decided** is required: the `USER:` source of the process owner who merged
  the file on the project's default branch. The seeded default carries
  `kit-default` instead; that marker is valid only while the file is
  identical to the kit's `presets/default.md`, and the file is then shown as
  "kit default, not decided by this project". A file that differs from the
  kit's default by any byte needs its own `USER:` source.
- **Preset** names where the file started: `default`, `autopilot`, or
  `custom`.
- **Scope** is optional. Absent, the rules cover the whole System.
- **Expires** is optional, except that a file in which `entry`,
  `slice_addition`, `product_assumption`, or `completion` is the agent's must
  carry it. The date is inclusive: the rules expire from the next day, UTC.

A placeholder or malformed value is refused. Rules that are expired, refused,
or missing mean the default preset; the session says so at its start.

## Rows

Every row appears exactly once. A row the agent may decide accepts only its
own condition.

| Row | Decided by | Agent condition |
|---|---|---|
| `entry` | human, agent | `plan_review_passed` |
| `slice_addition` | human, agent | `narrow_review_passed` |
| `small_change_entry` | human, agent | `lane_authorization_current` |
| `pre_approved_entry` | human, agent | `user_source_names_scope` |
| `defect_fix` | human, agent | `failing_test_reproduces` |
| `incident_fix` | human, agent | `incident_declared` |
| `product_assumption` | human, agent | `reversible_inside_scope` |
| `completion` | human, agent | `evidence_complete` |
| `candidate_confirmation` | human | — |
| `demotion` | human | — |
| `acceptance_guide` | required, not_required | — |
| `tester_signoff` | required, not_required | — |
| `baseline_acceptance` | human | — |
| `gate_rules` | human | — |
| `lane_authorization` | human | — |

`incident_declared` holds only when a person's words declaring the incident
are quoted as a `USER:` source in the fix-first gap record; the agent never
declares one.

## Always-human areas

`sign_in`, `payments`, `existing_data`, `external_contract`, or `—` for none.
When a change touches an area a row names, a person decides that row. An
`incident_fix` row the agent may decide always names `sign_in`, `payments`,
and `existing_data`.

## Refusals

A file is refused, naming the line, for: an unknown row, condition, or area; a
condition another row owns; the agent on `candidate_confirmation`,
`demotion`, or an always-human row; an agent `incident_fix` row whose areas
omit `sign_in`, `payments`, or `existing_data`; a malformed or placeholder
`Scope` or `Expires`; an agent `entry`, `slice_addition`,
`product_assumption`, or `completion` row without `Expires`; a missing row; a
missing `Decided` source; and the `kit-default` marker on a file that differs
from the kit's default.
