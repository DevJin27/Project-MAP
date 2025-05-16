import { useState, useEffect } from 'react';

const MAX_DATA_POINTS = 20;

export const useTelemetryData = (lastMessage) => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [currentData, setCurrentData] = useState({});
  
  useEffect(() => {
    if (lastMessage) {
      // Update current data
      setCurrentData(lastMessage);
      
      // Add new data point to the time series
      setTelemetryData(prevData => {
        const newData = [...prevData, lastMessage];
        
        // Keep only the most recent MAX_DATA_POINTS
        if (newData.length > MAX_DATA_POINTS) {
          return newData.slice(newData.length - MAX_DATA_POINTS);
        }
        
        return newData;
      });
    }
  }, [lastMessage]);
  
  return { telemetryData, currentData };
};
