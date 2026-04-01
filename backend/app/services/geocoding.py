import logging
import os
from typing import Tuple

import requests

logger = logging.getLogger(__name__)

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
NOMINATIM_TIMEOUT_SECONDS = 8
DEFAULT_LATITUDE = float(os.getenv("DEFAULT_LATITUDE", "32.7767"))
DEFAULT_LONGITUDE = float(os.getenv("DEFAULT_LONGITUDE", "-96.7970"))
_geocode_cache: dict[str, Tuple[float, float, bool]] = {}


def geocode_location(location: str) -> Tuple[float, float, bool]:
    """
    Resolve a city/location string into latitude/longitude coordinates.
    Returns (latitude, longitude, geocoding_success).
    """
    normalized_location = location.strip().lower()

    if not normalized_location:
        logger.warning("Geocoding skipped for empty location. Using fallback coordinates.")
        return DEFAULT_LATITUDE, DEFAULT_LONGITUDE, False

    cached_result = _geocode_cache.get(normalized_location)
    if cached_result:
        return cached_result

    headers = {
        "User-Agent": os.getenv(
            "NOMINATIM_USER_AGENT",
            "SignalScope/1.0 (contact@example.com)",
        )
    }
    params = {"q": location, "format": "json", "limit": 1}

    logger.info("Geocoding request started for location='%s'", location)

    try:
        response = requests.get(
            NOMINATIM_URL,
            params=params,
            headers=headers,
            timeout=NOMINATIM_TIMEOUT_SECONDS,
        )
        response.raise_for_status()

        data = response.json()
        if data:
            latitude = float(data[0]["lat"])
            longitude = float(data[0]["lon"])
            result = (latitude, longitude, True)
            _geocode_cache[normalized_location] = result
            logger.info(
                "Geocoding success for location='%s' lat=%s lon=%s",
                location,
                latitude,
                longitude,
            )
            return result

        logger.warning(
            "Geocoding returned no results for location='%s'. Using fallback coordinates.",
            location,
        )
    except (requests.RequestException, ValueError, KeyError, TypeError) as exc:
        logger.warning(
            "Geocoding failed for location='%s'. Using fallback coordinates. Error=%s",
            location,
            exc,
        )

    return DEFAULT_LATITUDE, DEFAULT_LONGITUDE, False
