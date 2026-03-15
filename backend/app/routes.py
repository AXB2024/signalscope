from fastapi import APIRouter
from .models import Report
from .database import reports

router = APIRouter()

@router.post("/report")
def create_report(report: Report):
    reports.append(report)
    return {"message": "Report submitted", "report": report}

@router.get("/reports")
def get_reports():
    return reports

@router.get("/reports/location/{city}")
def get_reports_by_city(city: str):
    filtered = [r for r in reports if r.location.lower() == city.lower()]
    return filtered