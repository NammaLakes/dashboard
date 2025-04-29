// filepath: dashboard/src/lib/websocket-context.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface SensorReading {
  time: string;
  temperature: number;
  pH: number;
  oxygenLevel: number;
  node_id: string; // Assuming the backend sends the node_id
}

interface WebSocketContextProps {
  latestReadings: Record<string, SensorReading | null>; // Store latest reading per node_id
  historicalData: Record<string, SensorReading[]>; // Store recent history per node_id
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

// Determine WebSocket URL based on environment (adjust as needed)
const WS_URL = process.env.NODE_ENV === 'production'
  ? 'wss://your-production-domain.com/api/monitoring/ws' // Replace with your production WS URL
  : `ws://${window.location.hostname}:8000/api/monitoring/ws`; // Updated path

const MAX_HISTORY = 50; // Keep the last 50 readings per sensor

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [latestReadings, setLatestReadings] = useState<Record<string, SensorReading | null>>({});
  const [historicalData, setHistoricalData] = useState<Record<string, SensorReading[]>>({});
  const [isConnected, setIsConnected] = useState(false);

  const connectWebSocket = useCallback(() => {
    console.log(`Attempting to connect to WebSocket at ${WS_URL}`); // Log will show the new URL
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("Raw WebSocket message received:", event.data); // <-- Add this line
      try {
        const message = JSON.parse(event.data);
        // Assuming message format: { node_id: string, timestamp: string, payload: { temperature: number, pH: number, oxygenLevel: number } }
        // Or potentially just alert strings as currently implemented in backend/lakewatch/web/api/monitoring/views.py
        // *** Adjust parsing based on the actual data format sent by the backend ***
        if (typeof message === 'object' && message.node_id && message.payload) {
           const reading: SensorReading = {
             node_id: message.node_id,
             time: message.timestamp || new Date().toISOString(), // Use timestamp from message or current time
             temperature: message.payload.temperature,
             pH: message.payload.pH,
             oxygenLevel: message.payload.oxygenLevel,
           };
           console.log("Processed sensor reading:", reading); // <-- Add this line

           setLatestReadings(prev => ({ ...prev, [reading.node_id]: reading }));
           setHistoricalData(prev => {
             const history = prev[reading.node_id] || [];
             const newHistory = [...history, reading].slice(-MAX_HISTORY); // Add new reading and trim
             return { ...prev, [reading.node_id]: newHistory };
           });

        } else if (typeof message === 'string') {
          // Handle simple alert strings if needed (e.g., show a toast notification)
          console.log("Received alert string:", message);
          // Example: toast(message); // Requires integrating a toast library like sonner
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', event.data, error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      // Optional: Attempt to reconnect after a delay
      setTimeout(connectWebSocket, 5000);
    };

    // Cleanup function to close WebSocket when component unmounts
    return () => {
      ws.close();
    };
  }, []); // WS_URL is constant within the module scope, no need to add as dependency

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup; // Ensure cleanup is called on unmount
  }, [connectWebSocket]);


  return (
    <WebSocketContext.Provider value={{ latestReadings, historicalData }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};