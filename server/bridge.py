from pymavlink import mavutil
import requests

conn = mavutil.mavlink_connection("udp:127.0.0.1:14550")
conn.wait_heartbeat()

print("✅ Connected to ArduPilot SITL")

while True:
    msg = conn.recv_match(type="GLOBAL_POSITION_INT", blocking=True)

    telemetry = {
        "drone_id": "DR-SITL-01",
        "latitude": msg.lat / 1e7,
        "longitude": msg.lon / 1e7,
        "speed": msg.vx / 100,
        "battery": 100  # fake for now, SITL doesn't give real battery via this msg
    }

    try:
        resp = requests.post("http://localhost:8000/api/telemetry/ingest", json=telemetry)
        print(resp.status_code, resp.text)


    except Exception as e:
        print("Failed to send telemetry:", e)
