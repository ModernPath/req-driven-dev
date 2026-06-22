# 41 — Event Catalog

Canonical event definitions. Every event that crosses context boundaries must be defined here.

## 1. Conventions

### 1.1 Event Naming

- Format: `«context».«AggregateVerbed»` (e.g., `usr.UserCreated`, `ord.OrderShipped`)
- Past tense — events describe what happened
- Domain language from the glossary

### 1.2 Event Envelope

Every event is wrapped in a standard envelope:

```typescript
interface EventEnvelope<T> {
  event_id: string;        // UUIDv7, unique per event
  event_type: string;      // e.g., "usr.UserCreated"
  tenant_id: string;       // Owning tenant
  correlation_id: string;  // Links related operations
  causation_id?: string;   // ID of the event/command that caused this
  payload: T;              // Event-specific payload
  timestamp: string;       // ISO 8601 UTC
  schema_version: string;  // Payload schema version
}
```

### 1.3 Idempotency

Consumers MUST be idempotent on `event_id`. Processing the same event twice must have no additional effect.

---

## 2. Platform (PLT) Events

### 2.1 `plt.TenantCreated`

**Produced by:** CreateTenant command

**Payload:**
```typescript
{
  tenant_id: string;
  name: string;
  status: 'ACTIVE';
}
```

**Consumers:**
- All contexts — initialize tenant-scoped resources

### 2.2 `plt.UserCreated`

**Produced by:** CreateUser command

**Payload:**
```typescript
{
  user_id: string;
  tenant_id: string;
  email: string;
  status: 'PENDING' | 'ACTIVE';
}
```

**Consumers:**
- Notification service — send welcome email

---

## 3. «Context 1» («CTX1») Events

### 3.1 `«ctx1».«EventName»`

**Produced by:** «Command»

**Payload:**
```typescript
{
  «field»: «type»;
  «field»: «type»;
}
```

**Consumers:**
- `«ctx2»` — «what it does»

---

## 4. «Context 2» («CTX2») Events

«Same structure»

---

## Appendix: Schema Evolution

### Adding Fields

New optional fields can be added without version bump. Consumers must handle missing fields.

### Removing Fields

1. Mark field as deprecated in current version
2. Bump schema version
3. Remove field in new version
4. Consumers must handle both versions during transition

### Changing Field Types

Requires new event type or major version bump. Dual-publish during transition.
