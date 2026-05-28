# Data Model Design

## Overview

The data model is designed to handle multi-tenant ESG data ingestion with full audit trail, source tracking, and compliance requirements for external audits.

## Core Models

### 1. Company (Multi-tenancy)
```python
- id: Primary key
- name: Company name
- code: Unique company identifier
- created_at: Timestamp
```

**Design Decision**: Simple multi-tenancy model where each company is isolated. All emission records are scoped to a company, ensuring data separation for different clients.

**Why**: ESG data is highly sensitive and client-specific. Hard tenant isolation prevents data leakage and simplifies access control for auditors who need to review only one company's data.

### 2. DataSource (Source-of-Truth Tracking)
```python
- id: Primary key
- company: Foreign key to Company
- source_type: Enum (SAP, UTILITY, TRAVEL)
- filename: Original file name
- uploaded_by: User identifier
- upload_timestamp: When data was ingested
- row_count: Total rows in source
- processed_count: Successfully processed rows
- failed_count: Failed rows
```

**Design Decision**: Every upload creates a DataSource record that acts as the source-of-truth anchor. All emission records link back to their source.

**Why**: Auditors need to trace every emission record back to its original source file. This model provides full lineage: "This emission came from file X, uploaded by user Y, on date Z."

### 3. EmissionRecord (Core Data Model)
```python
- id: Primary key
- company: Foreign key to Company
- data_source: Foreign key to DataSource
- source_type: Enum (SAP, UTILITY, TRAVEL)
- source_row_number: Row number in original file
- raw_payload: JSON field storing original data
- activity_type: Normalized activity (e.g., "Fuel Combustion", "Electricity Consumption")
- scope_category: Enum (SCOPE_1, SCOPE_2, SCOPE_3)
- quantity: Original quantity value
- original_unit: Unit as provided in source
- normalized_quantity: Converted quantity
- normalized_unit: Standard unit
- period_start: Activity start date
- period_end: Activity end date
- status: Enum (PENDING, VALID, FAILED, SUSPICIOUS, APPROVED, REJECTED)
- validation_flags: JSON array of validation warnings
- is_locked: Boolean (true after approval)
- created_at: Timestamp
- updated_at: Timestamp
```

**Design Decisions**:

1. **raw_payload**: Stores the original source data as JSON. Critical for audit trail - we never lose the original data even after normalization.

2. **Dual quantity tracking**: Both `quantity/original_unit` and `normalized_quantity/normalized_unit` are stored. This allows auditors to verify normalization logic.

3. **Scope categorization**: Automatically assigned based on activity type:
   - SCOPE_1: Direct emissions (fuel combustion)
   - SCOPE_2: Indirect emissions (purchased electricity)
   - SCOPE_3: Value chain emissions (travel, procurement)

4. **Status workflow**: 
   - PENDING: Awaiting analyst review
   - VALID: Passed validation, ready for review
   - FAILED: Validation errors
   - SUSPICIOUS: Passed validation but flagged for review
   - APPROVED: Analyst approved, locked for audit
   - REJECTED: Analyst rejected

5. **is_locked**: Once approved, records are immutable. This ensures audit integrity - approved data cannot be modified.

**Why**: ESG reporting requires immutability after approval. Auditors need confidence that approved data hasn't changed since sign-off.

### 4. ReviewAction (Audit Trail)
```python
- id: Primary key
- record: Foreign key to EmissionRecord
- action_type: Enum (APPROVE, REJECT, EDIT)
- previous_value: JSON of old values
- new_value: JSON of new values
- comment: Analyst comment
- created_by: User identifier
- created_at: Timestamp
```

**Design Decision**: Every action on a record creates an immutable audit log entry.

**Why**: Auditors need to see:
- Who approved/rejected each record
- What was changed and when
- Why changes were made (comments)
- Complete history for compliance

## Multi-Tenancy Strategy

**Approach**: Row-level multi-tenancy with foreign key to Company.

**Why not separate databases?**
- Simpler deployment and maintenance
- Easier to implement cross-company analytics if needed
- PostgreSQL row-level security can be added later if needed

**Security**: All queries are filtered by company_id. API endpoints require company context.

## Scope 1/2/3 Categorization

**Implementation**: Automatic categorization based on activity type and source:

```python
SAP + Fuel keywords → SCOPE_1 (direct combustion)
SAP + Other materials → SCOPE_3 (purchased goods)
UTILITY + Electricity → SCOPE_2 (purchased electricity)
TRAVEL + All modes → SCOPE_3 (business travel)
```

**Why**: GHG Protocol defines clear boundaries. Automation reduces analyst burden and ensures consistency.

## Unit Normalization

**Strategy**: Store both original and normalized values.

**Normalization rules**:
- Volume: liters → liters (standard)
- Energy: kWh, MWh → kWh (standard)
- Distance: km, miles → km (standard)

**Why**: 
- Preserves original data for audit
- Enables consistent reporting across sources
- Allows verification of conversion logic

## Source-of-Truth Tracking

**Every record tracks**:
1. Which DataSource it came from
2. Which row number in the original file
3. Original raw data (raw_payload)
4. When it was ingested
5. Who uploaded it

**Why**: Complete lineage is mandatory for external audits. Auditors must be able to trace any emission value back to the source document.

## Audit Trail Requirements

**Immutability**: 
- Approved records cannot be edited (is_locked=True)
- All actions are logged in ReviewAction
- Original data is never deleted

**Traceability**:
- Every change has a timestamp and user
- Previous and new values are stored
- Comments explain why changes were made

**Why**: SOC 2, ISO 14064, and GHG Protocol all require immutable audit trails for verified emissions data.

## Data Integrity Constraints

1. **Foreign key constraints**: Ensure referential integrity
2. **Enum validation**: Status and source types are constrained
3. **Unique constraints**: Company codes are unique
4. **Not null constraints**: Critical fields cannot be null
5. **Check constraints**: Quantities must be positive

## Scalability Considerations

**Current design handles**:
- Multiple companies (multi-tenant)
- Multiple data sources per company
- Thousands of records per upload
- Full audit history

**Future scaling**:
- Add indexes on company_id, status, source_type for query performance
- Partition by company or date if data volume grows
- Archive old approved records to cold storage

## What This Model Does NOT Handle

1. **Carbon calculation**: No emission factors or CO2e calculations. This is a data ingestion and review system, not a carbon accounting engine.

2. **User authentication**: No user model. Uses simple username strings. Production would need proper auth.

3. **File storage**: Doesn't store original files, only metadata. Production would need S3/blob storage.

4. **Versioning**: No version history for records. Only tracks latest state + audit log.

## Trade-offs Made

**Simplicity over flexibility**: Fixed schema for emission records rather than EAV (Entity-Attribute-Value) model. This makes queries simpler but requires schema changes to add new fields.

**Denormalization**: Activity type and scope are stored on each record rather than normalized to separate tables. This improves query performance at the cost of some redundancy.

**JSON for flexibility**: raw_payload and validation_flags use JSON. This allows flexibility for different source formats but sacrifices some query performance.

## Why This Model Works for ESG Data

1. **Audit-ready**: Complete lineage from source to approved record
2. **Immutable**: Approved data cannot be changed
3. **Traceable**: Every action is logged with user and timestamp
4. **Multi-tenant**: Supports multiple client companies
5. **Scope-aware**: Automatically categorizes emissions by GHG Protocol scope
6. **Normalized**: Consistent units for reporting
7. **Flexible**: JSON fields handle varying source formats

This model prioritizes audit compliance and data integrity over performance optimization, which is the correct trade-off for ESG reporting systems.
