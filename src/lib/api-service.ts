import { toast } from '@/components/ui/use-toast';

// Define base URL for API calls - update this with your actual API endpoint
const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000/api/monitoring';

// Types for API responses
export interface Node {
  node_id: string;
  timestamp: number;
  datetime: string;
  latitude: number;
  longitude: number;
  temperature: number;
  ph: number;
  dissolved_oxygen: number;
  maintenance_required: number;
}

export interface NodesResponse {
  count: number;
  data: Node[];
}

export interface SensorData {
  node_id: string;
  timestamp: number;
  datetime: string;
  temperature: number;
  ph: number;
  dissolved_oxygen: number;
}

export interface SensorDataResponse {
  node_id: string;
  count: number;
  data: SensorData[];
}

export interface Alert {
  message: string;
  timestamp: number;
  datetime?: string;
  node_id?: string;
}

// Function to fetch all nodes
export const fetchNodes = async (): Promise<NodesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/get_nodes`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching nodes:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch sensor nodes. Please try again.',
      variant: 'destructive',
    });
    throw error;
  }
};

// Function to fetch data for a specific node
export const fetchNodeData = async (nodeId: string): Promise<SensorDataResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/get_data/${nodeId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data for node ${nodeId}:`, error);
    toast({
      title: 'Error',
      description: `Failed to fetch data for sensor ${nodeId}. Please try again.`,
      variant: 'destructive',
    });
    throw error;
  }
};

// WebSocket connection manager for alerts
export class AlertWebsocketManager {
  private ws: WebSocket | null = null;
  private onMessageCallback: ((alert: Alert) => void) | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  
  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  public connect(onMessage: (alert: Alert) => void): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }
    
    this.onMessageCallback = onMessage;
    // Update WebSocket URL to match your backend endpoint
    this.ws = new WebSocket(`${WS_BASE_URL}/ws`);
    
    this.ws.onopen = () => {
      console.log('Connected to alerts websocket at', `${WS_BASE_URL}/ws`);
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = this.handleMessage;
    this.ws.onclose = this.handleClose;
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  private handleMessage(event: MessageEvent): void {
    try {
      console.log('Received WebSocket message:', event.data);
      
      // Try to parse as JSON first
      let alert: Alert;
      if (typeof event.data === 'string') {
        try {
          alert = JSON.parse(event.data) as Alert;
        } catch (e) {
          // If not valid JSON, wrap the message in an Alert object
          alert = {
            message: event.data,
            timestamp: Date.now() / 1000,
            datetime: new Date().toISOString()
          };
        }
      } else {
        alert = event.data as Alert;
      }
      
      if (this.onMessageCallback) {
        console.log('Processing alert:', alert);
        this.onMessageCallback(alert);
      }
    } catch (error) {
      console.error('Error handling alert data:', error, 'Raw data:', event.data);
    }
  }
  
  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectTimeout = setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`);
        this.reconnectAttempts++;
        this.connect(this.onMessageCallback!);
      }, timeout);
    } else {
      console.error('Max reconnect attempts reached. Please refresh the page.');
      toast({
        title: 'Connection Lost',
        description: 'Failed to maintain connection to alert system. Please refresh the page.',
        variant: 'destructive',
      });
    }
  }
  
  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      this.ws.onclose = null; // Prevent the reconnect logic when we intentionally close
      this.ws.close();
      this.ws = null;
    }
    
    this.onMessageCallback = null;
  }
}

// Create a singleton instance of the WebSocket manager
export const alertWebsocketManager = new AlertWebsocketManager();