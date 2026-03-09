from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import employees, attendance, dashboard
from app.database import ping_db

app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight Human Resource Management System API",
    version="1.0.0",
)

# CORS — allow frontend origins
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# Also allow any Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "HRMS Lite API is running",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    db_ok = await ping_db()
    return {
        "status": "healthy" if db_ok else "unhealthy",
        "database": "connected" if db_ok else "disconnected",
    }
