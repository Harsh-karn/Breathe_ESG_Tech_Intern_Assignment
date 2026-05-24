# Data Model

The core problem of emissions data ingestion is dealing with disparate schemas, bad data, and the absolute requirement for auditability. Our data model is built to handle this reality.

## 1. Tenant (Multi-Tenancy)
Represents a client company. All data is scoped to a Tenant to ensure isolation.

## 2. DataUpload
Tracks each ingestion event (file upload or API sync).
- `source_type`: (SAP, Utility, Travel)
- `uploaded_by`: Who initiated the sync.
- `uploaded_at`: Timestamp.

## 3. NormalizedEmissionRecord
The single source of truth for normalized, reviewable data.
- **Polymorphism via raw payload:** Instead of creating a dozen different tables for every source system's schema, we store the *exact* original row/object in a `raw_payload` (JSONB). This is critical for the audit trail; auditors can always see exactly what came out of the source system.
- **Normalized Fields:** We extract only the fields necessary for carbon calculation: `quantity`, `normalized_unit`, `date_start`, `date_end`, and `scope_category`.
- **Validation Errors:** A JSONB field storing any parsing or mapping errors (e.g., "Unknown plant W001"). This allows the app to ingest everything (never losing data) while highlighting problematic rows for the analyst.
- **Status & Workflow:** `PENDING`, `APPROVED`, `REJECTED`. Analysts review pending rows, fix errors, and approve them.
- **Immutability Flags:** `is_edited` flags if an analyst touched the row before approval.

## 4. AuditLog
Tracks every manual edit an analyst makes to a `NormalizedEmissionRecord`.
- `field_name`
- `old_value`
- `new_value`
- `changed_by`
- `changed_at`
This guarantees source-of-truth tracking. If an auditor asks why a 1000 kWh bill was calculated as 100 kWh, the audit log will show the analyst corrected a typo.
