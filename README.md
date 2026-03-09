# HRMS Lite

A lightweight Human Resource Management System for managing employee records and tracking daily attendance.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router, Axios, Lucide Icons |
| **Backend** | Python 3.11+, FastAPI, Motor (async MongoDB driver), Pydantic |
| **Database** | MongoDB |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

## ✨ Features

- **Employee Management** – Add, view, and delete employee records
- **Attendance Tracking** – Mark daily attendance (Present/Absent) per employee
- **Dashboard** – Summary stats, department distribution, recent attendance
- **Dark/Light Mode** – Toggle with localStorage persistence
- **Responsive Design** – Works on desktop, tablet, and mobile
- **Date Filter** – Filter attendance records by date range
- **Attendance Stats** – View total present/absent days per employee
- **Validations** – Form validation, duplicate detection, error handling

## 🚀 Running Locally

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **MongoDB** (local or Atlas connection string)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env with your MongoDB connection string

# Start server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults to localhost:8000)
# echo VITE_API_URL=http://localhost:8000 > .env

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── config.py         # Environment settings
│   │   ├── database.py       # MongoDB connection
│   │   ├── models/           # Pydantic schemas
│   │   └── routes/           # API endpoints
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/              # API client (Axios)
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Theme context
│   │   ├── pages/            # Page components
│   │   ├── App.jsx           # Root component with routing
│   │   └── index.css         # Design system & theme
│   └── package.json
└── README.md
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | List all employees |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees/{id}` | Get employee by ID |
| DELETE | `/api/employees/{id}` | Delete employee |
| POST | `/api/attendance` | Mark attendance |
| GET | `/api/attendance/{employee_id}` | Get attendance records |
| GET | `/api/dashboard` | Dashboard summary |

## ⚠️ Assumptions & Limitations

- Single admin user (no authentication)
- Leave management, payroll, and advanced HR features are out of scope
- The system stores attendance as date strings (ISO format)
- Department list is predefined in the frontend dropdown

## 🌐 Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Database**: MongoDB Atlas (free tier)
