
import { useState, useEffect, useCallback, useRef } from 'react';
import { generateMockTelemetryData } from '../utils/mockData';

const useWebSocket = (url) => {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    // In development, if no URL is provided (demo mode) or if the backend isn't running, use simulated data
    if (!url || (process.env.NODE_ENV === 'development' && url && !url.includes('localhost'))) {
      console.info('Using simulated WebSocket for development or demo mode');
      
      // Set up simulated connection and data
      setConnected(true);
      const intervalId = setInterval(() => {
        const simulatedData = generateMockTelemetryData();
        setLastMessage(simulatedData);
      }, 2000);
      
      wsRef.current = {
        close: () => {
          clearInterval(intervalId);
          setConnected(false);
        }
      };
      
      return;
    }
    
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        
        // Try to reconnect after a delay
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connect();
          }, 5000);
        }
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnected(false);
    }
  }, [url]);
  
  useEffect(() => {
    connect();
    
    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);
  
  return { connected, lastMessage };
};

export default useWebSocket;
