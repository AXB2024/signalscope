import random
from datetime import datetime, timedelta
from typing import Any

from pymongo.collection import Collection

from .geocoding import DEFAULT_LATITUDE, DEFAULT_LONGITUDE

CITY_COORDINATES = {
    "Dallas": (32.7767, -96.7970),
    "Austin": (30.2672, -97.7431),
    "Frisco": (33.1507, -96.8236),
    "Plano": (33.0198, -96.6989),
    "Houston": (29.7604, -95.3698),
    "San Antonio": (29.4241, -98.4936),
    "Fort Worth": (32.7555, -97.3308),
    "Arlington": (32.7357, -97.1081),
}

ISSUE_TYPES = [
    "Internet outage",
    "Dropped calls",
    "Fiber cut",
    "5G instability",
    "Slow data throughput",
    "No signal",
]

DESCRIPTIONS = [
    "Users reporting intermittent packet loss in residential neighborhoods.",
    "Cell towers in the area are overloaded during peak evening hours.",
    "Backhaul maintenance introduced temporary service degradation.",
    "Weather-related disruptions impacting outdoor telecom equipment.",
    "Major outage reported by local businesses and home users.",
    "Engineers are actively rerouting traffic through backup links.",
]


def _random_timestamp() -> datetime:
    now = datetime.utcnow()
    day_offset = random.randint(0, 29)
    minute_offset = random.randint(0, 1439)
    return now - timedelta(days=day_offset, minutes=minute_offset)


def _jittered_coordinates(base_latitude: float, base_longitude: float) -> tuple[float, float]:
    # Keep markers near city centers while still looking realistic across neighborhoods.
    latitude = round(base_latitude + random.uniform(-0.04, 0.04), 6)
    longitude = round(base_longitude + random.uniform(-0.04, 0.04), 6)
    return latitude, longitude


def _build_seed_report() -> dict[str, Any]:
    city = random.choice(list(CITY_COORDINATES.keys()))
    base_latitude, base_longitude = CITY_COORDINATES[city]
    latitude, longitude = _jittered_coordinates(base_latitude, base_longitude)

    geocoding_success = random.random() < 0.95
    if not geocoding_success:
        latitude = DEFAULT_LATITUDE
        longitude = DEFAULT_LONGITUDE

    return {
        "location": city,
        "issue_type": random.choice(ISSUE_TYPES),
        "severity": random.choices([1, 2, 3, 4, 5], weights=[15, 20, 30, 22, 13], k=1)[0],
        "description": random.choice(DESCRIPTIONS),
        "timestamp": _random_timestamp(),
        "latitude": latitude,
        "longitude": longitude,
        "geocoding_success": geocoding_success,
    }


def seed_reports(collection: Collection, count: int = 80) -> dict[str, Any]:
    reports = [_build_seed_report() for _ in range(count)]
    insert_result = collection.insert_many(reports)

    return {
        "inserted_count": len(insert_result.inserted_ids),
        "requested_count": count,
        "cities_used": sorted(CITY_COORDINATES.keys()),
    }

