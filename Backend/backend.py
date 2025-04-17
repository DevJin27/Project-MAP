from fastapi import FastAPI, WebSocket
from starlette.websockets import WebSocketDisconnect
from dronekit import connect
import asyncio
import json

app = FastAPI()

vehicle = None  


@app.websocket("/ws/telemetry")
async def telemetryEndpoint(websocket: WebSocket):
    global vehicle
    await websocket.accept()

    try:
        if vehicle is None:
            print("Connecting to simulated drone...")
            vehicle = connect('udp:127.0.0.1:14550', wait_ready=True)

        while True:
            telemetry_data = {
                "battery": {
                    "voltage": vehicle.battery.voltage or 0.0,
                    "current": vehicle.battery.current or 0.0,
                    "level": vehicle.battery.level or 0
                },
                "location": {
                    "lat": vehicle.location.global_frame.lat or 0.0,
                    "lon": vehicle.location.global_frame.lon or 0.0,
                    "alt": vehicle.location.global_frame.alt or 0.0
                },
                "relative_altitude": vehicle.location.global_relative_frame.alt or 0.0,
                "mode": vehicle.mode.name if vehicle.mode else "Unknown",
                "armed": vehicle.armed,
                "airspeed": vehicle.airspeed or 0.0,
                "groundspeed": vehicle.groundspeed or 0.0,
                "heading": vehicle.heading or 0,
                "is_armable": vehicle.is_armable
            }

            await websocket.send_text(json.dumps(telemetry_data))
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        print("WebSocket client disconnected.")
    except Exception as e:
        print("Error in telemetry stream:", e)
    finally:
        await websocket.close()


@app.on_event("shutdown")
def shutdownEvent():
    if vehicle:
        print("Closing drone connection...")
        vehicle.close()
