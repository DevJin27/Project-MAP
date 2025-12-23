import asyncio
import random
from typing import List
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Telemetry

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_periodic_telemetry(self, websocket: WebSocket):
        db: Session = SessionLocal()

        lat, lng = 28.6139, 77.2090
        drone_id = f"DR-{random.randint(100,999)}"

        try:
            while True:
                lat += random.uniform(-0.0003, 0.0003)
                lng += random.uniform(-0.0003, 0.0003)

                data = {
                    "drone_id": drone_id,
                    "latitude": round(lat, 6),
                    "longitude": round(lng, 6),
                    "speed": round(random.uniform(10, 30), 2),
                    "battery": random.randint(10, 100),
                    "timestamp": datetime.utcnow()
                }

                # Save to DB
                record = Telemetry(**data)
                db.add(record)
                db.commit()

                # Stream to client
                await websocket.send_json({
                    **data,
                    "timestamp": data["timestamp"].isoformat()
                })

                await asyncio.sleep(2)

        except WebSocketDisconnect:
            print(f"WebSocket disconnected: {drone_id}")

        except Exception as e:
            print("Telemetry loop error:", e)

        finally:
            db.close()
