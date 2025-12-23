from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Telemetry

import logging
logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/api/telemetry", tags=["Telemetry"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{drone_id}")
def get_drone_telemetry(drone_id: str, limit: int = 20, db: Session = Depends(get_db)):
    return (
        db.query(Telemetry)
        .filter(Telemetry.drone_id == drone_id)
        .order_by(Telemetry.timestamp.desc())
        .limit(limit)
        .all()
    )

from datetime import datetime

@router.post("/ingest")
def ingest_telemetry(data: dict, db: Session = Depends(get_db)):
    logging.info(f"Incoming telemetry: {data}")

    record = Telemetry(
        drone_id=data["drone_id"],
        latitude=data["latitude"],
        longitude=data["longitude"],
        speed=data["speed"],
        battery=data["battery"],
        timestamp=datetime.utcnow()
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {"status": "stored", "drone_id": record.drone_id}
@router.get("/latest/{drone_id}")
def latest_telemetry(drone_id: str, db: Session = Depends(get_db)):
    latest = (
        db.query(Telemetry)
        .filter(Telemetry.drone_id == drone_id)
        .order_by(Telemetry.timestamp.desc())
        .first()
    )

    if not latest:
        return {"error": "No telemetry found"}

    return latest


