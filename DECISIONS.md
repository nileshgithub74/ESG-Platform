# Design Decisions

## Ambiguities Resolved

### 1. Ingestion Mechanism: File Upload vs API Pull

**Decision**: CSV file upload for all three sources.

**Why**:
- **SAP**: Real SAP exports are typically flat files (IDoc, CSV from transaction SE16, or BAPI exports). Most companies don't expose SAP directly via API for security reasons. Facilities teams export to CSV and upload.
- **Utility**: Most utility portals offer CSV downloads, not APIs. Even when APIs exist, they're often rate-limited or require complex OAuth. CSV upload is the realistic path.
- **Travel**: While Concur/Navan have APIs, many companies export monthly reports as CSV for compliance. API integration would be phase 2.

**What I'd ask the PM**: "Do any of these clients have direct API access, or are they all doing manual exports? If API access exists, which source should we prioritize?"

### 2. Unit Normalization Strategy

**Decision**: Store both original and normalized values.

**Why**: Auditors need to verify conversion logic. If we only store normalized values, we lose the ability to prove the conversion was correct. Storing both adds ~20% storage overhead but is mandatory for audit compliance.

**Alternative considered**: Only store normalized values with conversion metadata. Rejected because it makes audit verification harder.

**What I'd ask the PM**: "What's the approved conversion factor source? EPA? DEFRA? Client-specific factors?"

### 3. Validation: Fail Fast vs Warn and Continue

**Decision**: Warn and continue. Records with validation issues are marked SUSPICIOUS or FAILED but still ingested.

**Why**: In real ESG data, ~10-20% of rows have issues (missing dates, unusual values, unit mismatches). If we reject the entire upload, analysts lose visibility into what's wrong. Better to ingest everything and let analysts review.

**Example**: A utility bill with one meter reading 10x higher than usual. This could be a real spike or a data error. We flag it as SUSPICIOUS and let the analyst decide.

**What I'd ask the PM**: "What's the threshold for auto-rejection? Should we block uploads with >50% failed rows?"

### 4. Multi-Tenancy: Separate Databases vs Shared Schema

**Decision**: Shared database with row-level filtering by company_id.

**Why**: 
- Simpler deployment (one database, one migration)
- Easier to implement cross-company analytics if needed
- PostgreSQL row-level security can be added later
- Most ESG platforms (Watershed, Persefoni) use this approach

**Trade-off**: Requires careful query filtering to prevent data leakage. All API endpoints must filter by company.

**What I'd ask the PM**: "Are there any clients with data residency requirements (e.g., EU data must stay in EU)? That would require separate databases."

### 5. Scope Categorization: Manual vs Automatic

**Decision**: Automatic categorization based on activity type and source.

**Why**: GHG Protocol has clear rules:
- Fuel combustion → Scope 1
- Purchased electricity → Scope 2
- Business travel → Scope 3
- Purchased goods → Scope 3

Automation ensures consistency and reduces analyst workload.

**Edge case**: Some activities could be Scope 1 or 3 depending on context (e.g., diesel for owned vehicles vs contractor vehicles). Current implementation assumes owned assets.

**What I'd ask the PM**: "Do we need to support manual scope override for edge cases?"

### 6. Approval Workflow: Single-Step vs Multi-Step

**Decision**: Single-step approval. Analyst approves → record is locked.

**Why**: Simplicity. Most ESG workflows have one reviewer before audit.

**Alternative considered**: Two-step (reviewer → approver). Rejected for MVP but could be added with a "reviewed_by" and "approved_by" field.

**What I'd ask the PM**: "Do any clients require dual approval for high-value emissions?"

### 7. Date Handling: Billing Period vs Transaction Date

**Decision**: Store both period_start and period_end.

**Why**: 
- Utility bills have billing periods (e.g., Jan 1 - Jan 31)
- Travel has transaction dates (e.g., flight on Jan 15)
- SAP has posting dates

Storing both allows flexibility. For point-in-time transactions, period_start = period_end.

**What I'd ask the PM**: "How should we handle emissions that span multiple reporting periods?"

### 8. Failed Records: Reject vs Ingest with Errors

**Decision**: Ingest with FAILED status and validation_flags explaining why.

**Why**: Analysts need to see what failed and why. If we reject at upload, they have no visibility.

**Example**: A row with missing date gets status=FAILED and validation_flags=[{"type": "error", "message": "Missing period_start"}].

**What I'd ask the PM**: "Should failed records count toward the client's emissions total, or are they excluded?"

### 9. Audit Trail: What to Log

**Decision**: Log all approve/reject/edit actions with previous and new values.

**Why**: External auditors need to see:
- Who made the change
- What was changed
- When it was changed
- Why (comment field)

**Not logged**: Read operations (viewing records). This would create too much noise.

**What I'd ask the PM**: "Do we need to log who viewed each record for compliance?"

### 10. Data Retention: How Long to Keep Raw Data

**Decision**: Keep raw_payload forever.

**Why**: Audits can happen years after data ingestion. We need to prove the original data matched what we reported.

**Trade-off**: Storage cost increases over time. Could archive to cold storage after 7 years.

**What I'd ask the PM**: "What's the legal retention requirement? 7 years? 10 years?"

## Subset of Each Source Handled

### SAP Data
**Handled**:
- Material description (text field)
- Quantity (numeric)
- Unit (text field)
- Posting date (date field)

**Ignored**:
- Plant codes (would require lookup table)
- Cost center (not needed for emissions)
- Vendor information (not needed for emissions)
- Currency/pricing (not relevant)
- Document numbers (not needed for MVP)

**Why**: Focused on the minimum fields needed to calculate emissions. Plant codes and cost centers would be phase 2 for allocation.

**What would break in production**: 
- Multiple plants with different emission factors
- Material codes instead of descriptions (would need master data lookup)
- Non-English descriptions (would need translation or mapping)

### Utility Data
**Handled**:
- Consumption value (numeric)
- Unit (kWh, MWh)
- Billing start date
- Billing end date

**Ignored**:
- Meter IDs (not needed for MVP)
- Tariff structure (not needed for emissions)
- Demand charges (not relevant)
- Power factor (not relevant)
- Account numbers (not needed)

**Why**: Focused on consumption data only. Meter-level tracking would be phase 2.

**What would break in production**:
- Multiple meters per facility (would need aggregation)
- Different fuel types (gas, oil) mixed with electricity
- Renewable energy certificates (would need separate tracking)

### Travel Data
**Handled**:
- Travel mode (flight, train, car, taxi)
- Distance in km
- Booking date

**Ignored**:
- Passenger names (privacy concern)
- Cost/pricing (not relevant)
- Hotel stays (different emission factor)
- Rental car fuel type (would need separate handling)
- Flight class (economy vs business has different factors)

**Why**: Focused on distance-based emissions. Hotel and flight class would be phase 2.

**What would break in production**:
- Airport codes without distances (would need geocoding)
- Multi-leg trips (would need trip aggregation)
- Personal vs business travel (would need classification)

## Questions I'd Ask the PM

1. **Emission factors**: "Where do emission factors come from? EPA? DEFRA? Client-specific? Do we calculate CO2e or just track activity data?"

2. **Data quality thresholds**: "What % of failed rows is acceptable? Should we block uploads with >50% failures?"

3. **Approval authority**: "Who can approve records? Any role restrictions? Do high-value emissions need dual approval?"

4. **Reporting periods**: "Are clients on calendar year or fiscal year? How do we handle emissions that span periods?"

5. **Data corrections**: "If an analyst finds an error in an approved record, what's the process? Unlock and re-approve? Create an adjustment entry?"

6. **API vs upload**: "Is CSV upload acceptable long-term, or do we need to build API integrations? Which source should we prioritize?"

7. **Scope edge cases**: "How do we handle diesel for contractor vehicles? Scope 1 or 3? Who decides?"

8. **Audit requirements**: "What level of audit trail is required? SOC 2? ISO 14064? Do we need to log read operations?"

9. **Data residency**: "Any clients with EU data residency requirements? That would require separate databases."

10. **Carbon calculation**: "Is this system just for data ingestion and review, or do we need to calculate CO2e? If so, where do emission factors come from?"

## Key Architectural Decisions

### Why Django REST Framework?
- Mature, well-documented
- Built-in serialization and validation
- Easy to add authentication later
- Good for CRUD-heavy applications

### Why PostgreSQL?
- JSON field support for raw_payload and validation_flags
- Strong ACID guarantees (critical for audit data)
- Row-level security for multi-tenancy (future)

### Why React?
- Component-based UI matches the dashboard/modal pattern
- Large ecosystem for data tables and forms
- Easy to deploy to Vercel/Netlify

### Why CSV upload instead of API?
- Realistic for MVP (most companies export to CSV)
- Simpler to implement and test
- No OAuth/API key management
- Can add API ingestion later without changing data model

## What I Learned During Implementation

1. **Real SAP exports are messy**: Material descriptions are inconsistent, units vary, dates come in multiple formats. Normalization is harder than it looks.

2. **Utility data has billing periods, not point-in-time dates**: This affects how we aggregate emissions for monthly reports.

3. **Travel data often lacks distances**: Many systems only provide airport codes. Would need geocoding in production.

4. **Validation is a spectrum**: Not everything is pass/fail. Many records are "suspicious" and need human review.

5. **Audit trail is more important than I thought**: Every change needs to be logged with user, timestamp, and reason. This is non-negotiable for external audits.

## Decisions I'm Least Confident About

1. **No carbon calculation**: I focused on data ingestion and review, not CO2e calculation. This might be a gap if the PM expected end-to-end carbon accounting.

2. **Simple user model**: Using username strings instead of proper user authentication. This works for MVP but would need to be replaced.

3. **No file storage**: Not storing original CSV files, only metadata. Auditors might want to download the original file.

4. **Fixed schema**: Using a fixed schema for emission records rather than a flexible EAV model. This makes adding new fields harder but queries simpler.

These are the decisions I'd want to validate with the PM before going to production.
