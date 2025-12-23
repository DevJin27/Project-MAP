
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icon for the drone
const droneIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'drone-marker-icon pulse-animation'
});

// Component to update the map center when location changes
function ChangeMapView({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

const DroneMap = ({ location }) => {
  // Default center if no location is provided yet
  const defaultPosition = [28.6139, 77.2090];
  const currentPosition = location[0] && location[1] ? location : defaultPosition;
  const [mapTheme, setMapTheme] = useState('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  
  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <style jsx>{`
        .drone-marker-icon {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      
      <MapContainer 
        center={currentPosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={mapTheme}
        />
        <Marker position={currentPosition} icon={droneIcon}>
          <Popup className="custom-popup">
            <div className="p-1">
              <h3 className="font-medium text-sm mb-1">Drone Telemetry</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">Latitude:</span>
                <span className="font-mono">{currentPosition[0].toFixed(6)}</span>
                <span className="text-muted-foreground">Longitude:</span>
                <span className="font-mono">{currentPosition[1].toFixed(6)}</span>
                <span className="text-muted-foreground">Altitude:</span>
                <span className="font-mono">Unavailable</span>
                <span className="text-muted-foreground">Speed:</span>
                <span className="font-mono">Unavailable</span>
              </div>
            </div>
          </Popup>
        </Marker>
        <ChangeMapView center={currentPosition} />
      </MapContainer>
      
      <div className="absolute bottom-2 right-2 z-[1000] bg-background/80 backdrop-blur-sm rounded-md p-1 flex gap-1">
        <button 
          onClick={() => setMapTheme('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')}
          className={`px-2 py-1 text-xs rounded ${mapTheme.includes('openstreetmap') ? 'bg-primary text-primary-foreground' : 'bg-card'}`}
        >
          Street
        </button>
        <button 
          onClick={() => setMapTheme('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')}
          className={`px-2 py-1 text-xs rounded ${mapTheme.includes('arcgisonline') ? 'bg-primary text-primary-foreground' : 'bg-card'}`}
        >
          Satellite
        </button>
      </div>
    </div>
  );
};

export default DroneMap;
