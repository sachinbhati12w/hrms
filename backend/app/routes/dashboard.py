from fastapi import APIRouter
from datetime import date

from app.database import employees_collection, attendance_collection

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("")
async def get_dashboard():
    """Get dashboard summary statistics."""
    # Total employees
    total_employees = await employees_collection.count_documents({})

    # Today's attendance
    today_str = date.today().isoformat()
    today_present = await attendance_collection.count_documents(
        {"date": today_str, "status": "Present"}
    )
    today_absent = await attendance_collection.count_documents(
        {"date": today_str, "status": "Absent"}
    )

    # Department breakdown
    pipeline = [
        {"$group": {"_id": "$department", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    departments = []
    async for dept in employees_collection.aggregate(pipeline):
        departments.append({"department": dept["_id"], "count": dept["count"]})

    # Recent attendance records (last 10)
    recent_attendance = []
    cursor = attendance_collection.find().sort("date", -1).limit(10)
    async for record in cursor:
        recent_attendance.append(
            {
                "_id": str(record["_id"]),
                "employee_id": record["employee_id"],
                "employee_name": record.get("employee_name", ""),
                "date": record["date"],
                "status": record["status"],
            }
        )

    return {
        "total_employees": total_employees,
        "today_present": today_present,
        "today_absent": today_absent,
        "today_unmarked": total_employees - today_present - today_absent,
        "departments": departments,
        "recent_attendance": recent_attendance,
    }
