
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectionStatus from './ConnectionStatus';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const InfoPanel = ({ connected, currentData, isDemoMode }) => {
  const navigate = useNavigate();
  const [sessionTime, setSessionTime] = useState(0);
  
  // Track session time
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatSessionTime = () => {
    const hours = Math.floor(sessionTime / 3600);
    const minutes = Math.floor((sessionTime % 3600) / 60);
    const seconds = sessionTime % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleReconnect = () => {
    window.location.reload();
  };
  
  const handleEndSession = () => {
    navigate('/');
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Connection Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {isDemoMode ? (
          <div className="flex items-center justify-center bg-yellow-500/10 rounded-md px-3 py-2 mb-4">
            <div className="flex flex-col items-center">
              <Wifi size={36} className="text-yellow-500 mb-2 animate-pulse" />
              <span className="text-yellow-500 font-medium">Demo Mode Active</span>
            </div>
          </div>
        ) : (
          <ConnectionStatus connected={connected} />
        )}
        
        <div className="mt-4 space-y-4">
          <div className="bg-card/50 p-3 rounded-md border border-border/50">
            <h3 className="text-sm font-medium mb-1">Session Duration</h3>
            <p className="text-xl font-mono">{formatSessionTime()}</p>
          </div>
          
          <div className="bg-card/50 p-3 rounded-md border border-border/50">
            <h3 className="text-sm font-medium mb-1">Last Update</h3>
            <p className="text-muted-foreground">
              {currentData.timestamp 
                ? new Date(currentData.timestamp).toLocaleTimeString() 
                : 'No data received'}
            </p>
          </div>
          
          <div className="bg-card/50 p-3 rounded-md border border-border/50">
            <h3 className="text-sm font-medium mb-1">Coordinates</h3>
            <p className="text-muted-foreground">
              {currentData.latitude && currentData.longitude
                ? `${currentData.latitude.toFixed(4)}, ${currentData.longitude.toFixed(4)}`
                : 'No location data'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleReconnect}
        >
          <RefreshCw size={16} className="mr-2" />
          Reconnect
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50" 
          onClick={handleEndSession}
        >
          End Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InfoPanel;
