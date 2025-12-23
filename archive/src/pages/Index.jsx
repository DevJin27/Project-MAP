
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DroneMap from '../components/DroneMap';
import TelemetryChart from '../components/TelemetryChart';
import StatusCard from '../components/StatusCard';
import ConnectionStatus from '../components/ConnectionStatus';
import useWebSocket from '../hooks/useWebSocket';
import { useTelemetryData } from '../hooks/useTelemetryData';

const Index = () => {
  const { connected, lastMessage } = useWebSocket('ws://localhost:8000/ws/telemetry');
  const { telemetryData, currentData } = useTelemetryData(lastMessage);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <StatusCard 
            title="Battery Level" 
            value={currentData.battery ? `${currentData.battery}%` : 'N/A'} 
            icon="battery"
            color="drone-battery"
          />
          <StatusCard 
            title="Altitude" 
            value={currentData.altitude ? `${currentData.altitude}m` : 'N/A'} 
            icon="altitude"
            color="drone-altitude"
          />
          <StatusCard 
            title="Speed" 
            value={currentData.speed ? `${currentData.speed}m/s` : 'N/A'} 
            icon="speed"
            color="drone-speed"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-lg p-4 h-[400px]">
              <h2 className="text-lg font-semibold mb-2">Live Drone Location</h2>
              <DroneMap location={[currentData.latitude || 0, currentData.longitude || 0]} />
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-lg p-4 h-[400px]">
            <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
            <ConnectionStatus connected={connected} />
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Last Update</h3>
              <p className="text-muted-foreground">
                {currentData.timestamp 
                  ? new Date(currentData.timestamp).toLocaleTimeString() 
                  : 'No data received'}
              </p>
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Coordinates</h3>
                <p className="text-muted-foreground">
                  {currentData.latitude && currentData.longitude
                    ? `${currentData.latitude.toFixed(4)}, ${currentData.longitude.toFixed(4)}`
                    : 'No location data'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Live Telemetry</h2>
            <div className="h-[300px]">
              <TelemetryChart data={telemetryData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
