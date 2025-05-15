import asyncio
import json
import logging
import random
from datetime import datetime
from fastapi import WebSocket

logger=logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections=[]
        self.telemetry_task=None
    
    async def connect(self, websocket:WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket:WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message:str, websocket:WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message:str):
        disconnected=[]
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {e}")
                disconnected.append(connection)
        for connection in disconnected:
            self.disconnect(connection)
    
    async def send_periodic_telemetry(self, websocket:WebSocket):
        lat, lon=28.6139,77.2090
        altitude=200
        speed=15
        battery=100
        direction=random.uniform(0,360)
        speed_var=0.5
        altitude_var=5
        
        while True:
            try:
                dir_rad=direction*(3.14159/180)
                lat_change=speed*0.00001*0.5*2*(random.random()-0.5)
                lon_change=speed*0.00001*0.5*2*(random.random()-0.5)
                lat+=lat_change
                lon+=lon_change
                direction+=random.uniform(-10,10)
                speed+=random.uniform(-speed_var,speed_var)
                speed=max(5,min(30,speed))
                altitude+=random.uniform(-altitude_var,altitude_var)
                altitude=max(100,min(300,altitude))
                battery-=0.05
                battery=max(0,battery)
                timestamp=datetime.utcnow().isoformat()+"Z"
                telemetry={
                    "latitude":lat,
                    "longitude":lon,
                    "altitude":round(altitude,1),
                    "speed":round(speed,1),
                    "battery":round(battery,1),
                    "timestamp":timestamp,
                }
                await websocket.send_text(json.dumps(telemetry))
                await asyncio.sleep(2)
            except Exception as e:
                logger.error(f"Error sending telemetry: {e}")
                break
