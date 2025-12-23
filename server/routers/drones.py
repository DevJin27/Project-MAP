from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Drone

router = APIRouter(prefix="/api/drones", tags=["Drones"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_drone(drone: dict, db: Session = Depends(get_db)):
    new_drone = Drone(**drone)
    db.add(new_drone)
    db.commit()
    db.refresh(new_drone)
    return new_drone

@router.get("/")
def get_all_drones(db: Session = Depends(get_db)):
    return db.query(Drone).all()

@router.get("/{drone_id}")
def get_drone(drone_id: str, db: Session = Depends(get_db)):
    return db.query(Drone).filter(Drone.id == drone_id).first()
