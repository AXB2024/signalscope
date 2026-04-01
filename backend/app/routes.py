import re
from datetime import datetime
import logging

from fastapi import APIRouter, HTTPException, Query

from .database import debug_collection, reports_collection
from .models import ReportCreate, ReportDocument
from .services.geocoding import geocode_location
from .services.metrics import (
    get_analytics_metrics,
    get_geocoding_metrics,
    get_severity_metrics,
)
from .services.seed_data import seed_reports

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/report")
def create_report(report: ReportCreate):
    report_dict = report.model_dump()
    logger.info("Incoming /report payload: %s", report_dict)

    latitude, longitude, geocoding_success = geocode_location(report.location)
    if latitude is None or longitude is None:
        logger.error("Geocoding failed with invalid coordinates for payload: %s", report_dict)
        raise HTTPException(status_code=422, detail="Unable to geocode location.")

    report_document = ReportDocument(
        **report_dict,
        latitude=latitude,
        longitude=longitude,
        geocoding_success=geocoding_success,
    )

    report_to_insert = report_document.model_dump()
    logger.info("Prepared report document for insert: %s", report_to_insert)

    result = reports_collection.insert_one(report_to_insert)
    logger.info("Inserted report id=%s", result.inserted_id)

    return {
        "message": "Report saved",
        "id": str(result.inserted_id),
        "latitude": latitude,
        "longitude": longitude,
        "geocoding_success": geocoding_success,
    }


@router.get("/reports")
def get_reports():
    reports = []
    for report in reports_collection.find().sort("timestamp", -1):
        report["_id"] = str(report["_id"])
        reports.append(report)
    logger.info("Returning %s reports from MongoDB", len(reports))
    return reports


@router.get("/reports/location/{city}")
def get_reports_by_city(city: str):
    reports = []
    escaped_city = re.escape(city)
    for report in reports_collection.find(
        {"location": {"$regex": f"^{escaped_city}$", "$options": "i"}}
    ):
        report["_id"] = str(report["_id"])
        reports.append(report)
    return reports


@router.get("/metrics/geocoding")
def geocoding_metrics():
    return get_geocoding_metrics(reports_collection)


@router.get("/metrics/severity")
def severity_metrics():
    return get_severity_metrics(reports_collection)


@router.get("/metrics/analytics")
def analytics_metrics():
    return get_analytics_metrics(reports_collection)


@router.post("/seed/reports")
def seed_report_data(count: int = Query(default=80, ge=50, le=500)):
    return seed_reports(reports_collection, count=count)


@router.get("/debug/db-test")
def debug_db_test():
    test_document = {
        "type": "db-test",
        "message": "NetPulse MongoDB write/read check",
        "created_at": datetime.utcnow(),
    }
    insert_result = debug_collection.insert_one(test_document)
    created_document = debug_collection.find_one({"_id": insert_result.inserted_id})

    if created_document is None:
        raise HTTPException(status_code=500, detail="MongoDB debug test failed to retrieve document.")

    created_document["_id"] = str(created_document["_id"])

    return {
        "message": "MongoDB debug write/read successful",
        "inserted_id": str(insert_result.inserted_id),
        "document": created_document,
    }
