from pydantic import BaseModel
from datetime import datetime

class Report(BaseModel):
    location: str
    issue_type: str
    severity: int
    description: str | None = None
    timestamp: datetime = datetime.utcnow()