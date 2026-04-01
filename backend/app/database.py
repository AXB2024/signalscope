import os
from pathlib import Path
from typing import Tuple

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.collection import Collection

BACKEND_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_ROOT / ".env")

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "signal_scope")
REPORTS_COLLECTION_NAME = os.getenv("REPORTS_COLLECTION_NAME", "reports")
DEBUG_COLLECTION_NAME = os.getenv("DEBUG_COLLECTION_NAME", "debug_checks")

print("Loaded MONGO_URI:", "SET" if MONGO_URI else "NOT SET")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is missing. Check your .env file or environment variables.")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=8000)
db = client[MONGO_DB_NAME]
reports_collection: Collection = db[REPORTS_COLLECTION_NAME]
debug_collection: Collection = db[DEBUG_COLLECTION_NAME]


def ping_database() -> Tuple[bool, str]:
    try:
        client.admin.command("ping")
        print("MongoDB connected successfully")
        return True, f"Connected to MongoDB database '{MONGO_DB_NAME}'."
    except Exception as exc:  # pragma: no cover - defensive operational check
        print("MongoDB connection failed:", exc)
        return False, f"MongoDB connection failed: {exc}"
