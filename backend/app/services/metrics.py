from typing import Any

from pymongo.collection import Collection


def _safe_percentage(numerator: int, denominator: int) -> float:
    if denominator == 0:
        return 0.0
    return round((numerator / denominator) * 100, 2)


def get_geocoding_metrics(collection: Collection) -> dict[str, Any]:
    total_reports = collection.count_documents({})
    geocoded_filter = {
        "$or": [
            {"geocoding_success": True},
            {
                "geocoding_success": {"$exists": False},
                "latitude": {"$type": "number"},
                "longitude": {"$type": "number"},
            },
            {
                "geocoding_success": {"$exists": False},
                "lat": {"$type": "number"},
                "lng": {"$type": "number"},
            },
        ]
    }
    successful_geocoded_reports = collection.count_documents(geocoded_filter)
    unique_geocoded_cities = collection.distinct("location", geocoded_filter)

    return {
        "total_reports": total_reports,
        "total_geocoded_reports": successful_geocoded_reports,
        "unique_cities_geocoded": len(unique_geocoded_cities),
        "geocoding_success_rate": _safe_percentage(successful_geocoded_reports, total_reports),
    }


def get_severity_metrics(collection: Collection) -> dict[str, Any]:
    total_reports = collection.count_documents({})
    counts_by_severity = {severity: 0 for severity in range(1, 6)}

    for row in collection.aggregate(
        [
            {"$group": {"_id": "$severity", "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}},
        ]
    ):
        try:
            severity_level = int(row["_id"])
        except (TypeError, ValueError):
            continue
        if severity_level in counts_by_severity:
            counts_by_severity[severity_level] = row["count"]

    count_rows = [
        {"severity": severity, "count": counts_by_severity[severity]}
        for severity in range(1, 6)
    ]
    distribution_rows = [
        {
            "severity": severity,
            "percentage": _safe_percentage(counts_by_severity[severity], total_reports),
        }
        for severity in range(1, 6)
    ]

    return {
        "total_reports": total_reports,
        "counts_by_severity": count_rows,
        "distribution_percent": distribution_rows,
    }


def get_analytics_metrics(collection: Collection) -> dict[str, Any]:
    total_reports = collection.count_documents({})
    unique_locations_count = len(collection.distinct("location"))

    top_city_rows = list(
        collection.aggregate(
            [
                {"$group": {"_id": "$location", "count": {"$sum": 1}}},
                {"$sort": {"count": -1, "_id": 1}},
                {"$limit": 5},
            ]
        )
    )

    severity_rows = list(
        collection.aggregate(
            [{"$group": {"_id": None, "average_severity": {"$avg": "$severity"}}}]
        )
    )
    average_severity = round(float(severity_rows[0]["average_severity"]), 2) if severity_rows else 0.0

    reports_over_time_rows = [
        {"date": row["_id"], "count": row["count"]}
        for row in collection.aggregate(
            [
                {
                    "$group": {
                        "_id": {
                            "$dateToString": {
                                "format": "%Y-%m-%d",
                                "date": "$timestamp",
                            }
                        },
                        "count": {"$sum": 1},
                    }
                },
                {"$sort": {"_id": 1}},
            ]
        )
    ]

    top_cities = [{"city": row["_id"], "count": row["count"]} for row in top_city_rows]

    return {
        "total_reports": total_reports,
        "top_cities": top_cities,
        "average_severity": average_severity,
        "reports_over_time": reports_over_time_rows,
        "unique_locations_count": unique_locations_count,
    }
