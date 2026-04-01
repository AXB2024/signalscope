#!/usr/bin/env python3
"""Seed realistic outage reports directly into MongoDB."""

import argparse

from app.database import reports_collection
from app.services.seed_data import seed_reports


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed outage reports for SignalScope analytics.")
    parser.add_argument("--count", type=int, default=80, help="Number of reports to generate (minimum: 50)")
    args = parser.parse_args()
    if args.count < 50:
        parser.error("--count must be at least 50 to generate meaningful analytics.")

    result = seed_reports(reports_collection, count=args.count)
    print(
        "Seed complete:",
        f"inserted={result['inserted_count']}",
        f"requested={result['requested_count']}",
        f"cities={len(result['cities_used'])}",
    )


if __name__ == "__main__":
    main()
