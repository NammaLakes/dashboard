import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Node, Alert } from "./api-service";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// LocalStorage keys
export const LS_SENSOR_NODES_KEY = 'lakewatcher-sensor-nodes';
export const LS_ACTIVE_ALERTS_KEY = 'lakewatcher-active-alerts';
export const LS_ARCHIVED_ALERTS_KEY = 'lakewatcher-archived-alerts';

// Interface for enhanced node with alert status
export interface EnhancedNode extends Node {
  hasAlert: boolean;
  alertIds: string[];
}

// Interface for enhanced alert
export interface EnhancedAlert extends Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  resolved: boolean;
  archived: boolean;
  resolvedAt?: number;
}

// Get cached sensor nodes
export function getCachedNodes(): Record<string, EnhancedNode> {
  try {
    const cachedNodes = localStorage.getItem(LS_SENSOR_NODES_KEY);
    if (cachedNodes) {
      return JSON.parse(cachedNodes);
    }
  } catch (error) {
    console.error('Error reading nodes from localStorage:', error);
  }
  return {};
}

// Save nodes to cache
export function cacheNodes(nodes: Record<string, EnhancedNode>): void {
  try {
    localStorage.setItem(LS_SENSOR_NODES_KEY, JSON.stringify(nodes));
  } catch (error) {
    console.error('Error saving nodes to localStorage:', error);
  }
}

// Update a node in cache
export function updateCachedNode(nodeId: string, node: EnhancedNode): void {
  const nodes = getCachedNodes();
  nodes[nodeId] = node;
  cacheNodes(nodes);
}

// Get cached alerts (both active and archived)
export function getCachedAlerts(): {active: EnhancedAlert[], archived: EnhancedAlert[]} {
  try {
    const cachedActiveAlerts = localStorage.getItem(LS_ACTIVE_ALERTS_KEY);
    const cachedArchivedAlerts = localStorage.getItem(LS_ARCHIVED_ALERTS_KEY);
    
    return {
      active: cachedActiveAlerts ? JSON.parse(cachedActiveAlerts) : [],
      archived: cachedArchivedAlerts ? JSON.parse(cachedArchivedAlerts) : []
    };
  } catch (error) {
    console.error('Error reading alerts from localStorage:', error);
    return { active: [], archived: [] };
  }
}

// Save alerts to cache
export function cacheAlerts(active: EnhancedAlert[], archived: EnhancedAlert[]): void {
  try {
    localStorage.setItem(LS_ACTIVE_ALERTS_KEY, JSON.stringify(active));
    localStorage.setItem(LS_ARCHIVED_ALERTS_KEY, JSON.stringify(archived));
  } catch (error) {
    console.error('Error saving alerts to localStorage:', error);
  }
}

// Get status color for a node based on its state
export function getNodeStatusColor(status: string): string {
  switch (status) {
    case 'alert':
      return '#ef4444'; // Red for alerts
    case 'maintenance':
      return '#f59e0b'; // Yellow for maintenance
    case 'active':
    default:
      return '#22c55e'; // Green for active
  }
}

// Generate a consistent ID for an alert
export function generateAlertId(alert: Alert): string {
  return `${alert.timestamp}-${encodeURIComponent(alert.message || '').substring(0, 20)}`;
}

// Determine alert type based on message content
export function getAlertType(message: string): 'error' | 'warning' | 'info' {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('critical') || lowerMessage.includes('error')) {
    return 'error';
  } else if (lowerMessage.includes('warning') || lowerMessage.includes('exceeded') || 
            lowerMessage.includes('maintenance') || lowerMessage.includes('threshold')) {
    return 'warning';
  }
  
  return 'info';
}

// Get a human-readable status label
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'alert':
      return 'Alert';
    case 'maintenance':
      return 'Maintenance Required';
    case 'inactive':
      return 'Inactive';
    case 'active':
      return 'Active';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
