# Project agent instructions

## Operating mode

- Read and follow `.modernpath/rdd/AGENTS.md` for the delivery process.
- This file contains only project-specific repository, architecture, command,
  and safety rules.
- `CLAUDE.md` is a compatibility pointer and cannot override these files.
- If a project rule appears to change a shared lifecycle/gate/status invariant,
  stop and update the `req-driven-dev` source repository first.

## Product sources

| Path | Purpose |
|---|---|
| «docs path» | «canonical product/domain source» |
| «contracts path» | «canonical boundary schema» |
| «requirements path» | «bounded-context requirement ledgers» |
| «epics path» | «epic/spec/task records» |

## Repository topology

«Repositories/subtrees/packages and their source-of-truth rules.»

## Architecture and stack decisions

«Sourced, project-specific decisions and open TBDs.»

## Commands and verification

```sh
«focused test»
«integration/contract test»
«build/lint»
«runtime/browser verification»
«extract/validate/sync»
```

## Local safety and delivery

«Branch, commit, PR, generated-file, deployment, and destructive-action rules.»
