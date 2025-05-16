
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from "sonner";
import Header from '../components/Header';
import DroneMap from '../components/DroneMap';
import TelemetryCharts from '../components/TelemetryCharts';
import StatusCardsGrid from '../components/StatusCardsGrid';
import InfoPanel from '../components/InfoPanel';
import useWebSocket from '../hooks/useWebSocket';
import { useTelemetryData } from '../hooks/useTelemetryData';
import { generateMockTelemetryData } from '../utils/mockData';
import { Button } from "@/components/ui/button";
import { Expand } from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isDemoMode = queryParams.get('demo') === 'true';
  const host = queryParams.get('host') || 'localhost';
  const port = queryParams.get('port') || '8000';
  
  // In demo mode, don't provide a WebSocket URL so that mock data is used
  const wsUrl = isDemoMode ? null : `ws://${host}:${port}/ws/telemetry`;
  const { connected, lastMessage } = useWebSocket(wsUrl);
  const [mockData, setMockData] = useState(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
  // Generate mock data in demo mode
  useEffect(() => {
    if (isDemoMode) {
      const mockInterval = setInterval(() => {
        setMockData(generateMockTelemetryData());
      }, 1000);
      
      // Notify user they're in demo mode
      toast("Demo Mode Active", {
        description: "Using simulated drone data for demonstration",
        duration: 4000,
      });
      
      return () => clearInterval(mockInterval);
    }
  }, [isDemoMode]);
  
  // Connection status notification
  useEffect(() => {
    if (connected && !isDemoMode) {
      toast.success("Connected to Drone", {
        description: `Successfully connected to ${host}:${port}`,
      });
    } else if (!isDemoMode && !connected) {
      toast.error("Connection Failed", {
        description: "Could not connect to drone telemetry service",
      });
    }
  }, [connected, host, port, isDemoMode]);
  
  const { telemetryData, currentData } = useTelemetryData(isDemoMode ? mockData : lastMessage);

  const toggleMapExpansion = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isDemoMode={isDemoMode} />
      
      <main className="flex-1 container mx-auto p-4">
        <StatusCardsGrid currentData={currentData} />

        <div className={`grid grid-cols-1 ${isMapExpanded ? '' : 'lg:grid-cols-3'} gap-4 mb-4`}>
          <div className={`${isMapExpanded ? '' : 'lg:col-span-2'} relative`}>
            <div className="bg-card rounded-lg shadow-lg p-4 h-[400px]">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Live Drone Location</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMapExpansion}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Expand size={16} />
                </Button>
              </div>
              <DroneMap location={[currentData.latitude || 0, currentData.longitude || 0]} />
            </div>
          </div>
          
          {!isMapExpanded && (
            <InfoPanel 
              connected={isDemoMode ? true : connected} 
              currentData={currentData} 
              isDemoMode={isDemoMode} 
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <TelemetryCharts data={telemetryData} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
