# 00 — System Overview

> **One-line description:** «Describe your system in one sentence»

## 1. Purpose

«2-3 paragraphs explaining what the system does, who it's for, and why it exists»

## 2. Core Capabilities

- «Capability 1»
- «Capability 2»
- «Capability 3»
- «Add more as needed»

## 3. Non-Negotiables

These are absolute constraints that every feature must respect:

1. **«Constraint 1»** — «Explanation»
2. **«Constraint 2»** — «Explanation»
3. **«Constraint 3»** — «Explanation»

## 4. Conventions

### 4.1 Identifiers

- **Format:** «e.g., UUIDv7, ULID, sequential»
- **Generation:** «where IDs are generated»

### 4.2 Timestamps

- **Storage:** «e.g., UTC, ISO 8601»
- **Timezone handling:** «how timezones are managed»

### 4.3 Money

- **Representation:** «e.g., integer minor units (cents), decimal with precision»
- **Currency:** «default currency, multi-currency support»
- **Rounding:** «rounding rules»

### 4.4 Configuration

- **Static config:** «environment variables, config files»
- **Dynamic config:** «time-versioned config, feature flags»

## 5. Glossary (Ubiquitous Language)

| Term | Definition |
|------|------------|
| «Term 1» | «Definition» |
| «Term 2» | «Definition» |
| «Term 3» | «Definition» |

## 6. Document Map

| Doc | Purpose |
|-----|---------|
| `01-bounded-contexts.md` | Context map and ownership |
| `10-«domain».md` | «Domain» domain specification |
| `data/40-data-model.md` | Database schema |
| `data/41-event-catalog.md` | Event payloads |
| `api.md` | API conventions |
| `tech-stack.md` | Technology choices |
| `open-questions.md` | Unresolved design questions |
| `gap-register.md` | Known capability gaps |
