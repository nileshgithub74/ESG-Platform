# ESG Data Platform

A production-ready platform for ingesting, normalizing, validating, and reviewing ESG emissions data from multiple sources (SAP, Utility, Travel).

## 🚀 Live Application

- **Frontend**: [Your Vercel URL]
- **Backend API**: https://esg-platform-3im7.onrender.com
- **API Root**: https://esg-platform-3im7.onrender.com/api/

## 📋 Assignment Overview

This project was built as part of the BreatheESG Tech Intern assignment. It demonstrates:
- Multi-source data ingestion with realistic format handling
- Robust data normalization and validation
- Analyst review workflow with audit trail
- Production deployment on cloud platforms

## ✨ Key Features

### Data Ingestion
- **Multi-source support**: SAP (fuel/procurement), Utility (electricity), Travel (corporate travel)
- **CSV upload** with automatic parsing and validation
- **Flexible date parsing**: Handles multiple date formats (DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY, etc.)
- **Unit normalization**: Automatic conversion (gallons→liters, MWh→kWh, etc.)

### Validation & Quality Control
- **Automatic validation**: Missing fields, invalid units, date issues
- **Anomaly detection**: Flags suspicious values (unusually high quantities)
- **Status workflow**: PENDING → VALID/FAILED/SUSPICIOUS → APPROVED/REJECTED
- **Validation flags**: Detailed error/warning messages for each record

### Analyst Dashboard
- **Record filtering**: By company, status, source type, scope, search
- **Record detail view**: Full data inspection with raw source data
- **Review actions**: Approve, Reject, Edit with comments
- **Audit trail**: Complete history of all changes
- **Record locking**: Approved records are immutable

### Multi-tenancy
- **Company management**: Multiple companies with isolated data
- **Company selector**: Easy switching between companies during upload

## 🛠️ Tech Stack

**Backend**:
- Django 4.2 + Django REST Framework
- PostgreSQL (NeonDB)
- Python 3.9+

**Frontend**:
- React 18
- Tailwind CSS
- Axios for API calls

**Deployment**:
- Backend: Render
- Frontend: Vercel
- Database: NeonDB (PostgreSQL)

## 📁 Project Structure

```
├── backend/
│   ├── config/              # Django settings
│   ├── core/
│   │   ├── models/          # Company, DataSource, EmissionRecord, ReviewAction
│   │   ├── views/           # API endpoints (upload, records, dashboard)
│   │   ├── serializers/     # DRF serializers
│   │   ├── services/        # Normalizers, unit converters
│   │   └── validators/      # Record validation logic
│   ├── requirements.txt
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # ReviewDashboard, UploadCenter
│   │   ├── components/      # Reusable UI components
│   │   └── services/        # API client (api.js)
│   ├── package.json
│   └── tailwind.config.js
│
├── MODEL.md                 # Data model documentation
├── DECISIONS.md             # Design decisions
├── TRADEOFFS.md             # What was not built
└── SOURCES.md               # Source format research
```

## 🔌 API Endpoints

### Upload
- `POST /api/upload/sap/` - Upload SAP CSV
- `POST /api/upload/utility/` - Upload Utility CSV
- `POST /api/upload/travel/` - Upload Travel CSV

### Records
- `GET /api/records/` - List records (with filters)
- `GET /api/records/{id}/` - Get record detail
- `PATCH /api/records/{id}/approve/` - Approve record
- `PATCH /api/records/{id}/reject/` - Reject record
- `PATCH /api/records/{id}/edit/` - Edit record values

### Companies
- `GET /api/companies/` - List companies
- `POST /api/companies/` - Create company

### Dashboard
- `GET /api/dashboard/summary/` - Get statistics

## 🚀 Local Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (or NeonDB account)

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt
```

Create `.env` file:
```
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOW_ALL_ORIGINS=True
```

Run migrations and start server:
```bash
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8000/api
```

## 📊 Sample Data Format

### SAP CSV
```csv
plant_code,material_description,quantity,unit,posting_date,cost_center,vendor_name
P001,Diesel Fuel,5000,gallons,28-05-2026,CC-100,FuelCorp
P002,Natural Gas,12000,m3,27-05-2026,CC-200,GasSupply Inc
```

### Utility CSV
```csv
meter_id,site_name,billing_start,billing_end,consumption_value,unit,tariff_type
MTR-001,HQ Building,01-05-2026,31-05-2026,45000,kWh,Commercial
```

### Travel CSV
```csv
employee_name,departure_airport,arrival_airport,travel_mode,distance_km,hotel_nights,booking_date
John Smith,JFK,LAX,flight,3980,3,28-05-2026
```

## 🌐 Deployment

### Backend (Render)
1. Connect GitHub repository
2. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Start Command: `gunicorn config.wsgi:application`
3. Add environment variables (DATABASE_URL, SECRET_KEY, etc.)

### Frontend (Vercel)
1. Import GitHub repository
2. Configure:
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Add environment variable: `REACT_APP_API_URL`

## 📝 Documentation

- **MODEL.md**: Data model design and rationale
- **DECISIONS.md**: Key design decisions and justifications
- **TRADEOFFS.md**: Features deliberately not implemented
- **SOURCES.md**: Research on real-world data source formats

## 👤 Author

Nilesh Kumar

## 📧 Contact

For questions about this implementation, please contact through the assignment submission form.

---

**Note**: This project was built for the BreatheESG Tech Intern assignment (May 2026).
