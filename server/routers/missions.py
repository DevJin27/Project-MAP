from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Mission

router = APIRouter(prefix="/api/missions", tags=["Missions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_mission(mission: dict, db: Session = Depends(get_db)):
    new_mission = Mission(**mission)
    db.add(new_mission)
    db.commit()
    db.refresh(new_mission)
    return new_mission

@router.get("/")
def get_all_missions(db: Session = Depends(get_db)):
    return db.query(Mission).all()

@router.get("/{mission_id}")
def get_mission(mission_id: str, db: Session = Depends(get_db)):
    return db.query(Mission).filter(Mission.id == mission_id).first()
