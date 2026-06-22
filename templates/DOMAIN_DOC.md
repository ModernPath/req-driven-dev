# «NN» — «Domain Name»

## 1. Purpose and Scope

«2-3 paragraphs explaining what this domain does and its boundaries»

**In scope:**
- «Capability 1»
- «Capability 2»

**Out of scope:**
- «What this domain does NOT do»

## 2. Aggregates

### 2.1 «AggregateName»

**State machine:**

```
[INITIAL] ──Create──► [ACTIVE] ──Deactivate──► [INACTIVE]
                          │                        │
                          └──────Archive───────────┘
                                                   ▼
                                              [ARCHIVED]
```

**Properties:**
- `id: UUID` — unique identifier
- `tenantId: UUID` — owning tenant
- `«property»: «type»` — «description»
- `status: INITIAL | ACTIVE | INACTIVE | ARCHIVED`
- `createdAt: Timestamp`
- `updatedAt: Timestamp`

### 2.2 «Another Aggregate»

«Same structure»

## 3. Value Objects

| Value Object | Fields | Validation |
|--------------|--------|------------|
| «ValueObject1» | `«field1»: «type»`, `«field2»: «type»` | «validation rules» |
| «ValueObject2» | «fields» | «validation» |

## 4. Invariants

Invariants are rules that must NEVER be violated. Enforcement is mandatory.

| ID | Rule | Enforcement |
|----|------|-------------|
| INV-«CTX»-001 | «Rule description» | «Where/how enforced» |
| INV-«CTX»-002 | «Rule description» | «Where/how enforced» |
| INV-«CTX»-003 | «Rule description» | «Where/how enforced» |

## 5. Business Rules

Business rules govern behavior but may have exceptions or be configurable.

| ID | Rule | Source | Config Key (if any) |
|----|------|--------|---------------------|
| BR-«CTX»-001 | «Rule description» | «Legal ref / business requirement» | `«config.key»` |
| BR-«CTX»-002 | «Rule description» | «Source» | — |

## 6. Commands

### 6.1 «CommandName»

**Input:**
```typescript
{
  «field»: «type»,
  «field»: «type»
}
```

**Preconditions:**
- «Precondition 1»
- «Precondition 2»

**Effects:**
- «What changes»
- Emits: `«ctx».«EventName»`

**Errors:**
- `«ERROR_CODE»` — «when this error occurs»

### 6.2 «Another Command»

«Same structure»

## 7. Events

### 7.1 `«ctx».«EventName»`

**Produced by:** «CommandName»

**Payload:**
```typescript
{
  «field»: «type»,
  «field»: «type»
}
```

**Consumers:**
- `«other_ctx»` — «what it does with this event»

### 7.2 `«ctx».«AnotherEvent»`

«Same structure»

## 8. Policies (Event → Command Reactions)

| Trigger Event | Reaction | Condition |
|---------------|----------|-----------|
| `«ctx».«Event»` | Execute «Command» | «When condition is met» |
| `«other_ctx».«Event»` | Execute «Command» | «Condition» |

## 9. Read Models / Queries

### 9.1 «QueryName»

**Purpose:** «What information this provides»

**Input:** «filter parameters»

**Output:**
```typescript
{
  items: [{
    «field»: «type»
  }],
  pagination: { ... }
}
```

## 10. Integration Points

### With «Other Context»

- **Consumes:** `«other_ctx».«Event»` → «reaction»
- **Produces:** `«ctx».«Event»` → consumed by «other_ctx» for «purpose»
- **Queries:** «if any synchronous queries»

### With External Systems

- **«System Name»:** «integration description»

## 11. API Endpoints (if applicable)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/«resource»` | Create «resource» | Bearer |
| GET | `/api/v1/«resource»/{id}` | Get «resource» by ID | Bearer |
| PUT | `/api/v1/«resource»/{id}` | Update «resource» | Bearer |
| DELETE | `/api/v1/«resource»/{id}` | Delete «resource» | Bearer |

## 12. Open Questions

| ID | Question | Owner | Blocking |
|----|----------|-------|----------|
| Q-«CTX»-1 | «Question» | «Owner» | «What it blocks» |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| «YYYY-MM-DD» | Initial version | «Name» |
