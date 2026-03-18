from fastapi import APIRouter
from .models import Report
from .database import reports_collection
import requests

router = APIRouter()

def geocode_location(location: str):
    url = "https://nominatim.openstreetmap.org/search"
    
    # Nominatim REQUIRES a custom User-Agent, or they block you with an HTML page.
    headers = {
        "User-Agent": "SignalScopeApp/1.0 (contact@yourdomain.com)" # Replace with a real email/app name
    }
    
    params = {
        "q": location,
        "format": "json"
    }

    try:
        # Pass the headers into your request
        response = requests.get(url, params=params, headers=headers)

        # 1. Catch API blocks or rate limits immediately
        if response.status_code != 200:
            print(f"Nominatim API Error {response.status_code}: {response.text}")
            return None, None

        # 2. Safely parse the JSON
        data = response.json()

        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
            
    except requests.exceptions.RequestException as e:
        print(f"Network error occurred: {e}")
    except ValueError:
        print(f"Invalid JSON received. Raw text: {response.text}")
        
    return None, None


@router.post("/report")
def create_report(report: Report):

    lat, lng = geocode_location(report.location)

    report_dict = report.dict()

    report_dict["lat"] = lat
    report_dict["lng"] = lng

    reports_collection.insert_one(report_dict)

    return {
        "message": "Report submitted",
        "lat": lat,
        "lng": lng
    }

@router.get("/reports")
def get_reports():

    reports = []

    for report in reports_collection.find():
        report["_id"] = str(report["_id"])
        reports.append(report)

    return reports

@router.get("/reports/location/{city}")
def get_reports_by_city(city: str):

    reports = []

    for report in reports_collection.find({"location": city}):
        report["_id"] = str(report["_id"])
        reports.append(report)

    return reports


