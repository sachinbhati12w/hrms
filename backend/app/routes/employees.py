from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from datetime import datetime

from app.database import employees_collection, attendance_collection
from app.models.employee import EmployeeCreate, EmployeeResponse, EmployeeListResponse

router = APIRouter(prefix="/api/employees", tags=["Employees"])


def employee_helper(employee: dict) -> dict:
    """Convert MongoDB document to response-friendly dict."""
    return {
        "_id": str(employee["_id"]),
        "employee_id": employee["employee_id"],
        "full_name": employee["full_name"],
        "email": employee["email"],
        "department": employee["department"],
        "created_at": employee["created_at"],
    }


@router.get("", response_model=EmployeeListResponse)
async def list_employees():
    """Get all employees."""
    employees = []
    cursor = employees_collection.find().sort("created_at", -1)
    async for employee in cursor:
        employees.append(employee_helper(employee))
    return {"employees": employees, "total": len(employees)}


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    """Create a new employee."""
    # Check for duplicate employee_id
    existing_by_id = await employees_collection.find_one(
        {"employee_id": employee.employee_id}
    )
    if existing_by_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with ID '{employee.employee_id}' already exists.",
        )

    # Check for duplicate email
    existing_by_email = await employees_collection.find_one(
        {"email": employee.email}
    )
    if existing_by_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with email '{employee.email}' already exists.",
        )

    employee_dict = employee.model_dump()
    employee_dict["created_at"] = datetime.utcnow()

    result = await employees_collection.insert_one(employee_dict)
    new_employee = await employees_collection.find_one({"_id": result.inserted_id})

    return employee_helper(new_employee)


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: str):
    """Get a single employee by employee_id."""
    employee = await employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found.",
        )
    return employee_helper(employee)


@router.delete("/{employee_id}", status_code=status.HTTP_200_OK)
async def delete_employee(employee_id: str):
    """Delete an employee and their attendance records."""
    employee = await employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found.",
        )

    # Delete attendance records for this employee
    await attendance_collection.delete_many({"employee_id": employee_id})

    # Delete the employee
    await employees_collection.delete_one({"employee_id": employee_id})

    return {"message": f"Employee '{employee_id}' and their attendance records deleted successfully."}
