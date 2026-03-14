from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.core.database import get_db
from app.models.outage import Outage, SeverityLevel, OutageStatus

router = APIRouter()


class OutageCreate(BaseModel):
    title: str
    description: str | None = None
    latitude: float
    longitude: float
    severity: SeverityLevel = SeverityLevel.medium
    provider: str | None = None
    reported_by: str | None = None


class OutageResponse(OutageCreate):
    id: int
    status: OutageStatus

    class Config:
        from_attributes = True


@router.get("/", response_model=List[OutageResponse])
def list_outages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Outage).offset(skip).limit(limit).all()


@router.post("/", response_model=OutageResponse, status_code=201)
def create_outage(outage: OutageCreate, db: Session = Depends(get_db)):
    db_outage = Outage(**outage.model_dump())
    db.add(db_outage)
    db.commit()
    db.refresh(db_outage)
    return db_outage


@router.get("/{outage_id}", response_model=OutageResponse)
def get_outage(outage_id: int, db: Session = Depends(get_db)):
    outage = db.query(Outage).filter(Outage.id == outage_id).first()
    if not outage:
        raise HTTPException(status_code=404, detail="Outage not found")
    return outage


@router.patch("/{outage_id}/status")
def update_status(outage_id: int, status: OutageStatus, db: Session = Depends(get_db)):
    outage = db.query(Outage).filter(Outage.id == outage_id).first()
    if not outage:
        raise HTTPException(status_code=404, detail="Outage not found")
    outage.status = status
    db.commit()
    return {"id": outage_id, "status": status}
