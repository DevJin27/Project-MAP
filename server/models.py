from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from database import Base
from datetime import datetime

class Drone(Base):
    __tablename__ = "drones"

    id = Column(String, primary_key=True, index=True)
    model = Column(String)
    status = Column(String)
    battery = Column(Integer)
    home_lat = Column(Float)
    home_lng = Column(Float)
    last_ping = Column(DateTime, default=datetime.utcnow)


class Mission(Base):
    __tablename__ = "missions"

    id = Column(String, primary_key=True, index=True)
    drone_id = Column(String, ForeignKey("drones.id"))
    start_lat = Column(Float)
    start_lng = Column(Float)
    end_lat = Column(Float)
    end_lng = Column(Float)
    status = Column(String)
    priority = Column(String)


class Telemetry(Base):
    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True)
    drone_id = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    speed = Column(Float)
    battery = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
