# 40 — Data Model

Canonical database schema definitions. The source of truth for all table structures.

## 1. Conventions

### 1.1 General Rules

- Every table has `tenant_id` for multi-tenancy (except global reference data)
- Every table has `id` as primary key (UUIDv7)
- Timestamps use `timestamptz` (UTC)
- Money uses integer minor units (cents) with a separate currency column
- Soft deletes use `deleted_at` timestamp where applicable

### 1.2 Naming

- Tables: `snake_case`, singular (e.g., `user_account`, `order`)
- Columns: `snake_case`
- Foreign keys: `«referenced_table»_id`
- Indexes: `idx_«table»_«columns»`
- Constraints: `chk_«table»_«rule»`, `uq_«table»_«columns»`

### 1.3 Cross-Context References

Contexts may NOT have foreign keys to other contexts' tables (except `plt.tenant`). Cross-context references use opaque UUIDs resolved via events or queries.

---

## 2. Platform (PLT)

### 2.1 `plt.tenant`

```sql
CREATE TABLE plt.tenant (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  name            text NOT NULL,
  status          text NOT NULL CHECK (status IN ('ACTIVE', 'SUSPENDED', 'TERMINATED')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
```

### 2.2 `plt.user_account`

```sql
CREATE TABLE plt.user_account (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  tenant_id       uuid NOT NULL REFERENCES plt.tenant(id),
  email           text NOT NULL,
  status          text NOT NULL CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT uq_user_account_email UNIQUE (tenant_id, email)
);
```

### 2.3 `plt.audit_event`

```sql
CREATE TABLE plt.audit_event (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  tenant_id       uuid NOT NULL REFERENCES plt.tenant(id),
  correlation_id  uuid NOT NULL,
  actor_type      text NOT NULL CHECK (actor_type IN ('human', 'agent', 'system')),
  actor_id        uuid NOT NULL,
  action          text NOT NULL,
  target_type     text NOT NULL,
  target_id       uuid,
  payload         jsonb,
  prev_hash       text NOT NULL,
  hash            text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Audit log is append-only
REVOKE UPDATE, DELETE ON plt.audit_event FROM app_user;
```

---

## 3. «Context 1» («CTX1»)

### 3.1 `«ctx1».«table_name»`

```sql
CREATE TABLE «ctx1».«table_name» (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  tenant_id       uuid NOT NULL REFERENCES plt.tenant(id),
  «column»        «type» NOT NULL,
  «column»        «type»,
  status          text NOT NULL CHECK (status IN ('«STATE1»', '«STATE2»')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Row-Level Security
ALTER TABLE «ctx1».«table_name» ENABLE ROW LEVEL SECURITY;
ALTER TABLE «ctx1».«table_name» FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON «ctx1».«table_name»
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

## 4. «Context 2» («CTX2»)

«Same structure»

---

## Appendix: Common Patterns

### Row-Level Security (RLS)

Every tenant-scoped table should have RLS enabled:

```sql
ALTER TABLE «schema».«table» ENABLE ROW LEVEL SECURITY;
ALTER TABLE «schema».«table» FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON «schema».«table»
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### Immutability Trigger

For tables that should never be updated after creation:

```sql
CREATE OR REPLACE FUNCTION fn_reject_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Modification of % records is forbidden', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_«table»_immutable
  BEFORE UPDATE OR DELETE ON «schema».«table»
  FOR EACH ROW
  EXECUTE FUNCTION fn_reject_modification();
```
