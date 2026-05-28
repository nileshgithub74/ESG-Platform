# ESG Data Platform

Production-ready ESG data ingestion, normalization, validation, and analyst review platform.

## 🚀 Tech Stack

**Backend**: Django + Django REST Framework + PostgreSQL (NeonDB)  
**Frontend**: React + Tailwind CSS  
**Deployment**: Backend on Render, Frontend on Vercel

## ✨ Features

- Multi-tenant data ingestion (SAP, Utility, Travel sources)
- Automatic data normalization and unit conversion
- Validation and anomaly detection
- Analyst review dashboard with approve/reject/edit workflows
- Immutable audit trail
- Record locking for compliance

## 🌐 Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://esg-platform-3im7.onrender.com
- **API Docs**: https://esg-platform-3im7.onrender.com/api/

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL (or NeonDB account)

## 🛠️ Local Setup

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

## 🌐 Local Access

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/

## 🎯 Quick Start

1. Start both servers (backend + frontend)
2. Go to http://localhost:3000
3. Click "Upload Data"
4. Upload sample CSVs
5. Review records in the dashboard

## 📁 Project Structure

```
├── backend/          # Django API
│   ├── config/       # Settings
│   ├── core/         # Main app
│   │   ├── models/   # Database models
│   │   ├── views/    # API views
│   │   ├── serializers/  # DRF serializers
│   │   └── services/ # Business logic
└── frontend/         # React UI
    ├── src/
    │   ├── pages/    # Dashboard, Upload
    │   ├── components/  # Reusable components
    │   └── services/ # API client
```

## 🔌 API Endpoints

- `POST /api/upload/{source_type}/` - Upload CSV (source_type: sap, utility, travel)
- `GET /api/records/` - List records (with filters)
- `GET /api/records/{id}/` - Get record detail
- `PATCH /api/records/{id}/approve/` - Approve record
- `PATCH /api/records/{id}/reject/` - Reject record
- `PATCH /api/records/{id}/edit/` - Edit record
- `GET /api/dashboard/summary/` - Dashboard statistics

## 🚢 Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command**: `gunicorn config.wsgi:application`
4. Add environment variables:
   - `SECRET_KEY`
   - `DEBUG=False`
   - `ALLOWED_HOSTS=your-app.onrender.com`
   - `DATABASE_URL` (NeonDB connection string)
   - `CORS_ALLOW_ALL_ORIGINS=True`

### Frontend (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add environment variable:
   - `REACT_APP_API_URL=https://esg-platform-3im7.onrender.com/api`

## 🔐 Environment Variables

**Backend (.env)**:
```
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.onrender.com
CORS_ALLOW_ALL_ORIGINS=True
```

**Frontend**:
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## 📝 License

Nilesh Kumar
