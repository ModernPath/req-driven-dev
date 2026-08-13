# Progress projection template

Generated from the consuming project's requirement ledgers. Do not hand-edit;
see `.modernpath/rdd/process/state-tracking.md`.

Plan requirements with Prompt 1 (`.modernpath/rdd/process/prompts.md`); build
them with Prompt 3.

| Context | DONE | IN_REVIEW | IN_PROGRESS | READY | PROPOSED | DEFERRED | BLOCKED | Total |
|---|---|---|---|---|---|---|---|---|
| *No contexts seeded yet* | — | — | — | — | — | — | — | — |
| **All** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **0** |

---

## How to Update

Run this after any merge to regenerate the table:

```bash
# Example script — customize for your project
for ctx in libs/*/; do
  name=$(basename "$ctx")
  if [ -f "$ctx/REQUIREMENTS.md" ]; then
    counts=$(grep "^\- \*\*Status:\*\*" "$ctx/REQUIREMENTS.md" | \
      awk -F'·' '{print $1}' | \
      sed 's/.*Status:\*\* //' | \
      sort | uniq -c | \
      awk '{printf "%s:%d ", $2, $1}')
    echo "| $name | $counts |"
  fi
done
```

Or use a proper script that parses the markdown and outputs the table.
