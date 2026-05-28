# ESG Data Platform

Production-style MVP for ESG data ingestion, normalization, validation, and analyst review.

## 🚀 Tech Stack

**Backend**: Django + Django REST Framework + PostgreSQL (NeonDB)  
**Frontend**: React + Tailwind CSS  


## ✨ Features

- Multi-tenant data ingestion (SAP, Utility, Travel sources)
- Automatic data normalization and unit conversion
- Validation and anomaly detection
- Analyst review dashboard with approve/reject/edit workflows
- Immutable audit trail
- Record locking for compliance
- Admin dashboard with statistics

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL (or NeonDB account)

## 🛠️ Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py load_sample_data
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## 🌐 Access

- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/

## 📊 Default Credentials

- Username: `admin`
- Password: `admin123`

## 🎯 Quick Start

1. Start both servers (backend + frontend)
2. Go to http://localhost:3000/admin
3. Click "Upload Data"
4. Upload sample CSVs from `backend/sample_data/`
5. Review records in the dashboard

## 📁 Project Structure

```
├── backend/          # Django API
│   ├── config/       # Settings
│   ├── core/         # Main app
│   └── sample_data/  # Sample CSVs
├── frontend/         # React UI
│   ├── src/
│   │   ├── pages/    # Dashboard, Upload, Admin
│   │   └── components/
└── README.md
```

## 🔌 API Endpoints

- `POST /api/upload/{source_type}/` - Upload CSV
- `GET /api/records/` - List records (with filters)
- `GET /api/records/{id}/` - Get record detail
- `PATCH /api/records/{id}/approve/` - Approve record
- `PATCH /api/records/{id}/reject/` - Reject record
- `PATCH /api/records/{id}/edit/` - Edit record
- `GET /api/dashboard/summary/` - Statistics

## 🚢 Deployment

### Environment Variables

**Backend (.env)**:
```
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.com
```

**Frontend**:
```
REACT_APP_API_URL=https://your-backend.com/api
```



## 📝 License
Nilesh Kumar
