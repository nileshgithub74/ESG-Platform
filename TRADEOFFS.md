# Trade-offs: What We Deliberately Did NOT Build

## 1. Carbon Calculation (CO2e Computation)

### What We Didn't Build
No emission factor database, no CO2e calculation, no carbon footprint totals.

The system tracks **activity data** (liters of diesel, kWh of electricity, km traveled) but does not convert it to **carbon emissions** (tCO2e).

### Why We Didn't Build It

**Scope creep**: The assignment asks for "ingest, normalize, and let analysts review." Carbon calculation is a separate, complex problem.

**Emission factors are contentious**: 
- EPA, DEFRA, and IEA all publish different factors
- Factors change annually
- Some clients have custom factors from their auditors
- Location-based vs market-based electricity factors (Scope 2)

**Example**: 1 kWh of electricity in California (clean grid) has a different emission factor than 1 kWh in West Virginia (coal-heavy grid). We'd need:
- Grid emission factors by region
- Market-based factors for renewable energy purchases
- Annual updates as grids decarbonize

**What we'd need to add**:
- Emission factor database (1000+ factors)
- Factor versioning (factors change yearly)
- Location mapping (grid regions, countries)
- Calculation engine
- Unit tests for every factor

**Time estimate**: 2-3 additional days just for emission factors.

**Decision**: Focus on data quality and audit trail. Carbon calculation can be added later or done in a separate system (many companies use specialized tools like Watershed or Persefoni for this).

### What We'd Build Next
If we were to add carbon calculation:
1. Emission factor table with source, version, and effective dates
2. Calculation engine that applies factors to normalized quantities
3. Separate "calculated emissions" table to keep raw data immutable
4. Factor audit trail (which factor was used for each calculation)

---

## 2. User Authentication and Authorization

### What We Didn't Build
No user accounts, no login system, no role-based access control (RBAC).

The system uses simple username strings (e.g., "analyst@company.com") but doesn't verify identity or enforce permissions.

### Why We Didn't Build It

**Not the core problem**: The assignment focuses on data ingestion and review workflow, not identity management.

**Authentication is a solved problem**: Django has built-in auth, and there are many libraries (django-allauth, Auth0, Okta). Adding it is straightforward but time-consuming.

**What we'd need to add**:
- User model with password hashing
- Login/logout views
- Session management
- Password reset flow
- Role model (Analyst, Approver, Admin)
- Permission checks on every API endpoint
- Frontend login UI

**Time estimate**: 1-2 days for basic auth, more for RBAC.

**Current workaround**: The system accepts any username string. In production, this would be replaced with proper authentication.

### What We'd Build Next
If we were to add authentication:
1. Django's built-in User model
2. JWT tokens for API authentication
3. Role-based permissions:
   - **Analyst**: Can review and approve records
   - **Uploader**: Can upload data but not approve
   - **Admin**: Can manage companies and users
   - **Auditor**: Read-only access to approved records
4. Company-level access control (users can only see their company's data)

**Why this is okay for MVP**: The data model and audit trail are designed to support proper auth. Adding it later won't require schema changes.

---

## 3. Original File Storage

### What We Didn't Build
No storage of the original CSV files. We store metadata (filename, upload timestamp, row count) and the raw data from each row (raw_payload JSON), but not the actual file.

### Why We Didn't Build It

**Storage cost**: Storing every uploaded file adds significant storage cost, especially for large clients with monthly uploads.

**Redundancy**: We already store the raw data from each row in the `raw_payload` JSON field. The original file can be reconstructed from this data if needed.

**Complexity**: File storage requires:
- S3 or blob storage integration
- Signed URLs for secure downloads
- File retention policies
- Backup and disaster recovery

**Time estimate**: 1 day to integrate S3 and add download endpoints.

**Current workaround**: The `raw_payload` field stores the original row data as JSON. Analysts can see the original data for each record in the detail modal.

### What We'd Build Next
If we were to add file storage:
1. S3 bucket for file storage
2. Store S3 key in DataSource model
3. Signed URL generation for secure downloads
4. File retention policy (e.g., keep for 7 years, then archive to Glacier)
5. Download button in the UI to retrieve original files

**Why this is okay for MVP**: Auditors care more about row-level lineage (which we have) than the original file. The `raw_payload` field provides the same information.

**Trade-off**: If the original file has metadata (e.g., header comments, formatting) that's not in the row data, we lose it. For ESG data, this is usually not critical.

---

## Honorable Mentions: Other Things We Didn't Build

### 4. Bulk Operations
No bulk approve/reject. Analysts must review records one at a time.

**Why**: Encourages careful review. Bulk operations increase the risk of approving bad data.

**When we'd add it**: If analysts are approving 1000+ records per day, bulk operations with filters (e.g., "approve all VALID records from this source") would be needed.

---

### 5. Data Export to External Systems
No integration with carbon accounting platforms (Watershed, Persefoni) or ERP systems.

**Why**: The assignment asks for a review dashboard, not a full integration platform.

**When we'd add it**: Phase 2, after the review workflow is proven.

---

### 6. Advanced Validation Rules
No custom validation rules per company (e.g., "flag any diesel purchase >1000 liters").

**Why**: The current validation (missing fields, unusual values) covers 80% of issues. Custom rules would require a rule engine.

**When we'd add it**: If clients request specific validation logic.

---

### 7. Mobile App
No mobile interface. The React app is responsive but not optimized for mobile.

**Why**: Analysts typically work on desktops. Mobile is not a priority for ESG data review.

---

### 8. Real-Time Data Ingestion
No streaming ingestion or real-time APIs. All data is uploaded as batch files.

**Why**: ESG data is typically reported monthly or quarterly. Real-time ingestion is not needed.

**When we'd add it**: If clients want to connect live APIs (e.g., Concur API for travel data).

---

### 9. Data Visualization
No charts or graphs. The dashboard shows tables and summary stats, but no visual analytics.

**Why**: The assignment asks for a review dashboard, not a reporting tool. Visualization would be phase 2.

**When we'd add it**: After the review workflow is stable, add charts for emissions trends, scope breakdowns, etc.

---

### 10. Automated Anomaly Detection
No machine learning or statistical anomaly detection. Validation is rule-based (e.g., "quantity must be positive").

**Why**: ML requires training data and ongoing maintenance. Rule-based validation is simpler and more transparent.

**When we'd add it**: If we have enough historical data to train models (e.g., "flag electricity consumption >2 standard deviations from the mean").

---

## Summary

We deliberately focused on:
1. **Data model quality**: Multi-tenancy, audit trail, source tracking
2. **Review workflow**: Approve/reject/edit with full audit log
3. **Data normalization**: Unit conversion and scope categorization

We deliberately did NOT build:
1. **Carbon calculation**: Complex, contentious, and out of scope
2. **User authentication**: Solved problem, can be added later
3. **File storage**: Redundant with raw_payload, adds complexity

These trade-offs allowed us to deliver a high-quality MVP in 4 days that focuses on the core problem: **getting messy ESG data into a reviewable, auditable state**.

The things we didn't build are important for production, but they're not blockers for validating the core workflow. They can be added incrementally without major refactoring.
