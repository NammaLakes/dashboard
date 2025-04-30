import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { Alert, alertWebsocketManager, Node, SensorData, fetchNodes } from './api-service';
import { toast } from '@/components/ui/use-toast';
import { 
  getCachedNodes, cacheNodes, getCachedAlerts, cacheAlerts, 
  EnhancedNode, EnhancedAlert, getAlertType, generateAlertId
} from './utils';

interface WebSocketContextProps {
  latestReadings: Record<string, Node | null>; // Store latest reading per node_id
  historicalData: Record<string, SensorData[]>; // Store recent history per node_id
  alerts: EnhancedAlert[]; // Store alerts from WebSocket
  isPolling: boolean; // Whether the background polling is active
  resolveAlert: (alertId: string) => void; // Function to resolve an alert
  archivedAlerts: EnhancedAlert[]; // Store archived alerts
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [latestReadings, setLatestReadings] = useState<Record<string, Node | null>>({});
  const [historicalData, setHistoricalData] = useState<Record<string, SensorData[]>>({});
  const [alerts, setAlerts] = useState<EnhancedAlert[]>([]);
  const [archivedAlerts, setArchivedAlerts] = useState<EnhancedAlert[]>([]);
  const [isPolling, setIsPolling] = useState(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cachedNodesRef = useRef<Record<string, EnhancedNode>>({});

  // Initial load of cached data
  useEffect(() => {
    // Load cached nodes
    const nodes = getCachedNodes();
    cachedNodesRef.current = nodes;
    
    // Convert cached nodes to the format expected by components
    const convertedNodes: Record<string, Node | null> = {};
    Object.entries(nodes).forEach(([nodeId, node]) => {
      convertedNodes[nodeId] = node;
    });
    
    if (Object.keys(convertedNodes).length > 0) {
      setLatestReadings(convertedNodes);
    }
    
    // Load cached alerts
    const { active, archived } = getCachedAlerts();
    if (active.length > 0) {
      setAlerts(active);
    }
    if (archived.length > 0) {
      setArchivedAlerts(archived);
    }
  }, []);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    cacheAlerts(alerts, archivedAlerts);
  }, [alerts, archivedAlerts]);

  // Handler for incoming alerts from WebSocket
  const handleAlert = useCallback((alert: Alert) => {
    console.log('Processing alert in WebSocketContext:', alert);
    
    // Add timestamp if not present
    const alertWithTimestamp = {
      ...alert,
      datetime: alert.datetime || new Date().toISOString()
    };
    
    // Create enhanced alert with additional properties
    const enhancedAlert: EnhancedAlert = {
      ...alertWithTimestamp,
      id: generateAlertId(alertWithTimestamp),
      type: getAlertType(alertWithTimestamp.message || ''),
      resolved: false,
      archived: false
    };
    
    // Update alerts state
    setAlerts(prev => {
      // Check for duplicates based on ID
      const isDuplicate = prev.some(a => a.id === enhancedAlert.id);
      
      if (isDuplicate) {
        console.log('Duplicate alert detected, not adding to state');
        return prev;
      }
      
      console.log('Adding new alert to state');
      
      // If this alert is associated with a node, update the node's alert status
      if (enhancedAlert.node_id) {
        const nodeId = enhancedAlert.node_id;
        const cachedNodes = cachedNodesRef.current;
        
        if (cachedNodes[nodeId]) {
          // Update the node with alert information
          const updatedNode: EnhancedNode = {
            ...cachedNodes[nodeId],
            hasAlert: true,
            alertIds: [...(cachedNodes[nodeId].alertIds || []), enhancedAlert.id]
          };
          
          cachedNodesRef.current[nodeId] = updatedNode;
          
          // Update the cached nodes in localStorage
          cacheNodes(cachedNodesRef.current);
          
          // Also update the latestReadings state to reflect the change immediately
          setLatestReadings(prev => ({
            ...prev,
            [nodeId]: updatedNode
          }));
        }
      }
      
      return [enhancedAlert, ...prev];
    });
    
    // Show a toast notification for new alerts
    toast({
      title: 'New Alert',
      description: alertWithTimestamp.message,
      variant: 'destructive',
    });
    
    console.log('Alert processed successfully');
  }, []);

  // Background polling for node data
  const pollNodeData = useCallback(async () => {
    try {
      const response = await fetchNodes();
      const nodes = response.data;
      
      // Update latestReadings with the fresh data
      const newReadings: Record<string, Node | null> = {};
      const cachedNodes = {...cachedNodesRef.current};
      
      nodes.forEach(node => {
        const nodeId = node.node_id;
        
        // Check if this node already exists in our cache
        const existingNode = cachedNodes[nodeId];
        
        // Create an enhanced node with alert status preserved from cache if it exists
        const enhancedNode = {
          ...node,
          hasAlert: existingNode?.hasAlert ?? false,
          alertIds: existingNode?.alertIds ?? []
        };
        
        // Store in new readings and update cached nodes
        newReadings[nodeId] = enhancedNode;
        cachedNodes[nodeId] = enhancedNode;
        
        // Also update historical data
        setHistoricalData(prev => {
          const prevNodeData = prev[nodeId] || [];
          
          // Check if this reading is different from the last one
          const lastReading = prevNodeData[0];
          const isNewReading = !lastReading || 
            lastReading.timestamp !== node.timestamp || 
            lastReading.temperature !== node.temperature || 
            lastReading.ph !== node.ph || 
            lastReading.dissolved_oxygen !== node.dissolved_oxygen;
          
          if (isNewReading) {
            // Convert Node to SensorData format
            const sensorData: SensorData = {
              node_id: nodeId,
              timestamp: node.timestamp,
              datetime: node.datetime,
              temperature: node.temperature,
              ph: node.ph,
              dissolved_oxygen: node.dissolved_oxygen
            };
            
            // Add to the beginning and keep only the last 100 readings
            return {
              ...prev,
              [nodeId]: [sensorData, ...prevNodeData].slice(0, 100)
            };
          }
          
          return prev;
        });
      });
      
      // Update cached nodes ref and localStorage
      cachedNodesRef.current = cachedNodes;
      cacheNodes(cachedNodes);
      
      // Update state with new readings
      setLatestReadings(prev => {
        // Deep compare to prevent unnecessary re-renders
        const hasChanges = JSON.stringify(prev) !== JSON.stringify(newReadings);
        return hasChanges ? newReadings : prev;
      });
      
    } catch (error) {
      console.error('Error polling node data:', error);
      // Don't show toast on every failed poll to avoid spam
    }
  }, []);

  // Function to resolve an alert
  const resolveAlert = useCallback((alertId: string) => {
    const now = Date.now() / 1000;
    
    // Find the alert
    setAlerts(prevAlerts => {
      const alertIndex = prevAlerts.findIndex(a => a.id === alertId);
      if (alertIndex === -1) return prevAlerts;
      
      const alert = prevAlerts[alertIndex];
      
      // Create a resolved version of the alert
      const resolvedAlert: EnhancedAlert = {
        ...alert,
        resolved: true,
        archived: true,
        resolvedAt: now
      };
      
      // Remove from active alerts
      const newAlerts = [...prevAlerts];
      newAlerts.splice(alertIndex, 1);
      
      // Add to archived alerts
      setArchivedAlerts(prev => [resolvedAlert, ...prev]);
      
      // If the alert is associated with a node, update the node's alert status
      if (alert.node_id) {
        const nodeId = alert.node_id;
        const cachedNodes = {...cachedNodesRef.current};
        
        if (cachedNodes[nodeId]) {
          // Get all active alerts for this node
          const nodeActiveAlerts = newAlerts.filter(a => 
            a.node_id === nodeId && !a.resolved
          );
          
          // If no more active alerts, clear the node's alert status
          if (nodeActiveAlerts.length === 0) {
            const updatedNode: EnhancedNode = {
              ...cachedNodes[nodeId],
              hasAlert: false,
              alertIds: []
            };
            
            cachedNodes[nodeId] = updatedNode;
            cachedNodesRef.current = cachedNodes;
            
            // Update localStorage
            cacheNodes(cachedNodes);
            
            // Update latestReadings state
            setLatestReadings(prev => ({
              ...prev,
              [nodeId]: updatedNode
            }));
          } else {
            // Update the node's alertIds list
            const updatedNode: EnhancedNode = {
              ...cachedNodes[nodeId],
              alertIds: nodeActiveAlerts.map(a => a.id)
            };
            
            cachedNodes[nodeId] = updatedNode;
            cachedNodesRef.current = cachedNodes;
            
            // Update localStorage
            cacheNodes(cachedNodes);
          }
        }
      }
      
      return newAlerts;
    });
  }, []);

  // Start the background polling service
  useEffect(() => {
    // Initial fetch
    pollNodeData();
    
    // Set up polling interval (every 5 seconds)
    pollingIntervalRef.current = setInterval(pollNodeData, 5000);
    
    // Clean up on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [pollNodeData]);

  // Connect to WebSocket on component mount
  useEffect(() => {
    console.log('Connecting to WebSocket for alerts...');
    
    // Connect to alert WebSocket
    alertWebsocketManager.connect(handleAlert);
    
    // Clean up on unmount
    return () => {
      console.log('Disconnecting from WebSocket');
      alertWebsocketManager.disconnect();
    };
  }, [handleAlert]);

  return (
    <WebSocketContext.Provider value={{ 
      latestReadings, 
      historicalData, 
      alerts, 
      isPolling, 
      resolveAlert,
      archivedAlerts
    }}>
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