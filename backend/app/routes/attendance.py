from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status
from datetime import date, datetime

from app.database import attendance_collection, employees_collection
from app.models.attendance import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceListResponse,
)

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


def attendance_helper(record: dict) -> dict:
    """Convert MongoDB document to response-friendly dict."""
    return {
        "_id": str(record["_id"]),
        "employee_id": record["employee_id"],
        "employee_name": record.get("employee_name"),
        "date": record["date"],
        "status": record["status"],
    }


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: AttendanceCreate):
    """Mark attendance for an employee."""
    # Validate the employee exists
    employee = await employees_collection.find_one(
        {"employee_id": attendance.employee_id}
    )
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance.employee_id}' not found.",
        )

    # Check no future dates
    if attendance.date > date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot mark attendance for a future date.",
        )

    date_str = attendance.date.isoformat()

    # Check for duplicate attendance on the same date
    existing = await attendance_collection.find_one(
        {"employee_id": attendance.employee_id, "date": date_str}
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance already marked for employee '{attendance.employee_id}' on {date_str}.",
        )

    record = {
        "employee_id": attendance.employee_id,
        "employee_name": employee["full_name"],
        "date": date_str,
        "status": attendance.status.value,
    }

    result = await attendance_collection.insert_one(record)
    new_record = await attendance_collection.find_one({"_id": result.inserted_id})

    return attendance_helper(new_record)


@router.get("/{employee_id}", response_model=AttendanceListResponse)
async def get_attendance(
    employee_id: str,
    date_from: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
):
    """Get attendance records for an employee, with optional date filtering."""
    # Validate the employee exists
    employee = await employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found.",
        )

    query = {"employee_id": employee_id}

    # Apply date filters
    if date_from or date_to:
        date_filter = {}
        if date_from:
            date_filter["$gte"] = date_from
        if date_to:
            date_filter["$lte"] = date_to
        query["date"] = date_filter

    records = []
    cursor = attendance_collection.find(query).sort("date", -1)
    async for record in cursor:
        records.append(attendance_helper(record))

    present_count = sum(1 for r in records if r["status"] == "Present")
    absent_count = sum(1 for r in records if r["status"] == "Absent")

    return {
        "records": records,
        "total": len(records),
        "present_count": present_count,
        "absent_count": absent_count,
    }
