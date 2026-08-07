# 01 — Bounded Contexts (template)

## 1. Context Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    SHARED KERNEL / PLATFORM                      │
│  (identity, tenancy, audit, events, config, common utilities)    │
│                              PLT                                 │
└─────────────────────────────────────────────────────────────────┘
        ▲           ▲           ▲           ▲           ▲
        │           │           │           │           │
   ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐
   │  «CTX1» │ │  «CTX2» │ │  «CTX3» │ │  «CTX4» │ │  «CTX5» │
   │ «Name1» │ │ «Name2» │ │ «Name3» │ │ «Name4» │ │ «Name5» │
   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

## 2. Context Codes

| Code | Name | Purpose |
|------|------|---------|
| PLT | Platform | Shared kernel: identity, tenancy, audit, events, config |
| «CTX1» | «Name1» | «Brief purpose» |
| «CTX2» | «Name2» | «Brief purpose» |
| «CTX3» | «Name3» | «Brief purpose» |

## 3. Context Ownership

### PLT — Platform (Shared Kernel)

**Owns:**
- Tenant identity and multi-tenancy
- User accounts and authentication
- Audit log
- Event bus / outbox
- Time-versioned configuration

**Events produced:**
- `plt.UserCreated`
- `plt.TenantCreated`
- «etc.»

### «CTX1» — «Context Name 1»

**Owns:**
- «Aggregate 1»
- «Aggregate 2»
- «Value objects»

**Events produced:**
- `«ctx1».«EventName1»`
- `«ctx1».«EventName2»`

**Events consumed:**
- `«other_ctx».«EventName»` → triggers «reaction»

**Design doc:** `docs/10-«domain1».md`

### «CTX2» — «Context Name 2»

**Owns:**
- «Aggregates»

**Events produced:**
- «Events»

**Events consumed:**
- «Events and reactions»

**Design doc:** `docs/11-«domain2».md`

## 4. Single-Writer Rules

Each piece of data has exactly ONE context that may write it. Other contexts read via events or queries.

| Data | Single Writer | Readers |
|------|---------------|---------|
| User accounts | PLT | All contexts |
| «Data type 1» | «CTX1» | «CTX2, CTX3» |
| «Data type 2» | «CTX2» | «CTX1» |

## 5. Integration Patterns

### 5.1 Event-Driven (Preferred)

Contexts communicate primarily through events. The producing context emits an event; consuming contexts react.

```
«CTX1» ──[Event]──► Event Bus ──► «CTX2»
                              ──► «CTX3»
```

### 5.2 Query (When Necessary)

For synchronous reads, contexts may expose query APIs. The caller must handle the dependency gracefully.

```
«CTX2» ──[Query]──► «CTX1» API
```

### 5.3 Anti-Corruption Layer

When integrating with external systems, wrap them in an ACL that translates to/from the domain language.

## 6. Database Isolation

Each context owns its own schema/tables. Cross-context joins are forbidden.

- `plt.*` — Platform tables
- `«ctx1».*` — «Context 1» tables
- `«ctx2».*` — «Context 2» tables

Foreign keys may only reference tables within the same context (or PLT for tenant_id).
