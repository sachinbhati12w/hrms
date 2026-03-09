from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class EmployeeCreate(BaseModel):
    employee_id: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Unique employee identifier",
    )
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Full name of the employee",
    )
    email: EmailStr = Field(
        ...,
        description="Email address of the employee",
    )
    department: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Department of the employee",
    )


class EmployeeResponse(BaseModel):
    id: str = Field(..., alias="_id")
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime

    class Config:
        populate_by_name = True


class EmployeeListResponse(BaseModel):
    employees: List[EmployeeResponse]
    total: int
