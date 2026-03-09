from pydantic import BaseModel, Field
from typing import Optional, List
import datetime
from enum import Enum


class AttendanceStatus(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


class AttendanceCreate(BaseModel):
    employee_id: str = Field(
        ...,
        min_length=1,
        description="Employee ID to mark attendance for",
    )
    date: datetime.date = Field(
        ...,
        description="Date of attendance",
    )
    status: AttendanceStatus = Field(
        ...,
        description="Attendance status",
    )


class AttendanceResponse(BaseModel):
    id: str = Field(..., alias="_id")
    employee_id: str
    employee_name: Optional[str] = None
    date: str
    status: str

    class Config:
        populate_by_name = True


class AttendanceListResponse(BaseModel):
    records: List[AttendanceResponse]
    total: int
    present_count: int
    absent_count: int
