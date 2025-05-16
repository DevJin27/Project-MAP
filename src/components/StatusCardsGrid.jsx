
import React from 'react';
import StatusCard from './StatusCard';

const StatusCardsGrid = ({ currentData }) => {
  return (
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
  );
};

export default StatusCardsGrid;
