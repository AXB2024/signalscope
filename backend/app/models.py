from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class ReportCreate(BaseModel):
    location: str = Field(min_length=1)
    issue_type: str = Field(min_length=1)
    severity: int = Field(ge=1, le=5)
    description: str | None = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("location")
    @classmethod
    def normalize_location(cls, value: str) -> str:
        return " ".join(part.capitalize() for part in value.strip().split())

    @field_validator("issue_type")
    @classmethod
    def normalize_issue_type(cls, value: str) -> str:
        return value.strip()


class ReportDocument(ReportCreate):
    latitude: float
    longitude: float
    geocoding_success: bool
