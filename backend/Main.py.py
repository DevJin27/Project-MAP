import asyncio
import logging

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger=logging.getLogger(__name__)

app=FastAPI(
    title="M.A.P. (Maverick Admin Panel) API",
    description="API for real time drone telemetry monitoring",
    version="Alpha 0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from websocket import ConnectionManager

manager=ConnectionManager()

@app.get("/")
async def root():
    return {"message":"Maverick Admin Panel API is running"}

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        logger.info("Client connected to telemetry WebSocket")
        await manager.send_periodic_telemetry(websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("Client disconnected from telemetry WebSocket")

if __name__=="__main__":
    uvicorn.run("main:app",host="0.0.0.0",port=8000,reload=True)
