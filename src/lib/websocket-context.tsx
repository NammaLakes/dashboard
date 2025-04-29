import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Alert, alertWebsocketManager, Node, SensorData } from './api-service';
import { toast } from '@/components/ui/use-toast';

interface WebSocketContextProps {
  latestReadings: Record<string, Node | null>; // Store latest reading per node_id
  historicalData: Record<string, SensorData[]>; // Store recent history per node_id
  alerts: Alert[]; // Store alerts from WebSocket
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [latestReadings, setLatestReadings] = useState<Record<string, Node | null>>({});
  const [historicalData, setHistoricalData] = useState<Record<string, SensorData[]>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Handler for incoming alerts from WebSocket
  const handleAlert = useCallback((alert: Alert) => {
    console.log('Processing alert in WebSocketContext:', alert);
    
    // Add timestamp if not present
    const alertWithTimestamp = {
      ...alert,
      datetime: alert.datetime || new Date().toISOString()
    };
    
    // Add alert to the beginning of the list (most recent first)
    setAlerts(prev => {
      // Check for duplicates based on message and timestamp
      const isDuplicate = prev.some(
        a => a.message === alertWithTimestamp.message && 
             Math.abs(a.timestamp - alertWithTimestamp.timestamp) < 5 // Within 5 seconds
      );
      
      if (isDuplicate) {
        console.log('Duplicate alert detected, not adding to state');
        return prev;
      }
      
      console.log('Adding new alert to state');
      return [alertWithTimestamp, ...prev.slice(0, 99)]; // Keep last 100 alerts
    });
    
    // Show a toast notification for new alerts
    toast({
      title: 'New Alert',
      description: alertWithTimestamp.message,
      variant: 'destructive',
    });
    
    console.log('Alert processed successfully');
  }, []);

  // Connect to WebSocket on component mount
  useEffect(() => {
    console.log('Connecting to WebSocket for alerts...');
    
    // Connect to alert WebSocket
    alertWebsocketManager.connect(handleAlert);
    
    // Add some test alerts for debugging if needed
    // setTimeout(() => {
    //   const testAlert: Alert = {
    //     message: "Test alert: Temperature threshold exceeded: 32.5",
    //     timestamp: Date.now() / 1000,
    //     datetime: new Date().toISOString(),
    //     node_id: "test_node_01"
    //   };
      
    //   handleAlert(testAlert);
    //   console.log('Test alert generated');
    // }, 3000);
    
    // Clean up on unmount
    return () => {
      console.log('Disconnecting from WebSocket');
      alertWebsocketManager.disconnect();
    };
  }, [handleAlert]);

  return (
    <WebSocketContext.Provider value={{ latestReadings, historicalData, alerts }}>
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