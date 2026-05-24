# Decisions & Ambiguities Resolved

## 1. Subset of Sources Handled
- **SAP**: Handled a flat CSV export (ALV grid style). SAP BAPI/IDocs are too complex for a rapid prototype and usually require heavy IT involvement, whereas analysts can generate CSV reports themselves.
- **Utility**: Handled simple billing CSVs (Start Date, End Date, Usage). Ignored complex Time-of-Use (TOU) interval data for the prototype, as monthly aggregations are typically sufficient for baseline Scope 2 reporting.
- **Corporate Travel**: Handled the Concur Expense API v4 JSON format. We look specifically for `AIRFR` and `CAR` expense types containing `totalDistance`.

## 2. Ingestion Mechanism
- **File Upload (SAP & Utility)**: Facilities and Procurement teams often rely on manual exports. A file upload is the most realistic ingestion path for these older systems.
- **API Paste (Travel)**: Corporate travel systems have modern APIs. For the prototype, we simulate a webhook/API pull by allowing the user to paste the JSON payload. In production, this would be an automated background job.

## 3. Ambiguity: Bad Data Handling
**Decision**: Ingest everything, validate later.
If a CSV contains a malformed date or an unknown unit, we *do not* reject the file upload. We save the record with a `null` value for the broken field and populate the `validation_errors` JSON. This allows the analyst to fix it in the UI rather than fighting with Excel before uploading.

## Questions for the PM
1. Do we need to support translating physical quantities (e.g., USD spent) into emissions directly in this pipeline, or does the ingestion pipeline only pass normalized physical quantities to a downstream calculation engine?
2. For utility data, do we need to support overlapping billing periods across months (e.g., prorating days)?
