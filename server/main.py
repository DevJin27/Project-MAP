from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from websocket import ConnectionManager
from database import Base, engine
from routers import drones, missions

import logging
from routers import telemetry




Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="M.A.P API",
    description="Drone telemetry and control API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()

app.include_router(drones.router)
app.include_router(missions.router)
app.include_router(telemetry.router)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Maverick Admin Panel Backend",
        "version": "0.1"
    }

@app.get("/")
def root():
    return {"message": "Maverick Admin Panel backend is live"}

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    logger.info("WebSocket connected")

    try:
        await manager.send_periodic_telemetry(websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("WebSocket disconnected")


