
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = ({ connected }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`rounded-full p-5 ${
        connected 
          ? 'bg-drone-connection/10 text-drone-connection' 
          : 'bg-destructive/10 text-destructive'
      }`}>
        {connected ? (
          <Wifi size={40} className="animate-pulse" />
        ) : (
          <WifiOff size={40} />
        )}
      </div>
      <h3 className="mt-3 text-lg font-medium">
        {connected ? 'Connected' : 'Disconnected'}
      </h3>
      <p className="text-muted-foreground text-center mt-1 max-w-[200px]">
        {connected 
          ? 'Receiving real-time telemetry data' 
          : 'Attempting to connect to drone...'}
      </p>
    </div>
  );
};

export default ConnectionStatus;
