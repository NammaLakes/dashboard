import { useEffect, useRef, useMemo, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '@/lib/websocket-context';
import { Node } from '@/lib/api-service';
import { getNodeStatusColor, getStatusLabel } from '@/lib/utils';

interface SensorMapProps {
  singleMarker?: { lat: number; lng: number };
}

interface SensorInfo {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'alert' | 'maintenance' | 'inactive';
  readings: {
    temperature: number;
    ph: number;
    oxygenLevel: number;
  };
}

const SensorMap = ({ singleMarker }: SensorMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const markersDataRef = useRef<Record<string, { marker: L.CircleMarker, status: string }>>({});
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const { latestReadings, alerts } = useWebSocket();

  // Transform API data into map markers
  const sensors = useMemo<SensorInfo[]>(() => {
    if (singleMarker) return [];
    
    return Object.values(latestReadings)
      .filter((node): node is Node => node !== null)
      .map((node: Node) => {
        // Determine status based on alerts and maintenance
        let status: 'active' | 'alert' | 'maintenance' | 'inactive' = 'active';
        
        // Check if the node has alerts
        if (node.hasAlert === true) {
          status = 'alert';
          console.log(`Node ${node.node_id} has active alerts: ${node.alertIds?.join(', ')}`);
        }
        // Otherwise, check if maintenance is required
        else if (node.maintenance_required === 1) {
          status = 'maintenance';
        }
        
        return {
          id: node.node_id,
          name: `Sensor ${node.node_id}`,
          location: {
            lat: node.latitude,
            lng: node.longitude
          },
          status: status,
          readings: {
            temperature: node.temperature,
            ph: node.ph,
            oxygenLevel: node.dissolved_oxygen
          }
        };
      });
  }, [latestReadings, singleMarker]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // If map is already initialized, don't recreate it
    if (!map.current) {
      // Get initial center coordinates
      let initialCoords: [number, number];
      if (singleMarker) {
        initialCoords = [singleMarker.lat, singleMarker.lng];
      } else if (sensors.length > 0) {
        initialCoords = [sensors[0].location.lat, sensors[0].location.lng];
      } else {
        // Default coordinates (Bangalore)
        initialCoords = [12.9716, 77.5946];
      }

      // Create map
      map.current = L.map(mapContainer.current).setView(initialCoords, 12);
      
      // Add tile layer
      L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
        minZoom: 0,
        maxZoom: 22,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
      }).addTo(map.current);
      
      setInitialized(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle single marker (for sensor detail view)
  useEffect(() => {
    if (!map.current || !initialized) return;
    
    // Clear any existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    markersDataRef.current = {};
    
    // If showing a single marker (for SensorDetail)
    if (singleMarker) {
      const marker = L.circleMarker([singleMarker.lat, singleMarker.lng], {
        radius: 8,
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 0.8,
        weight: 2
      }).addTo(map.current);
      
      markersRef.current.push(marker);
      map.current.setView([singleMarker.lat, singleMarker.lng], 14);
    }
  }, [singleMarker, initialized]);

  // Update multiple markers (for Dashboard)
  useEffect(() => {
    if (!map.current || !initialized || singleMarker || sensors.length === 0) return;
    
    console.log('Updating map markers with latest sensor data', sensors);
    
    // Process each sensor
    sensors.forEach((sensor) => {
      const sensorId = sensor.id;
      const newStatus = sensor.status;
      
      // Set marker color based on status using our utility function
      const markerColor = getNodeStatusColor(newStatus);
      
      console.log(`Sensor ${sensorId} status: ${newStatus}, color: ${markerColor}`);
      
      // Check if this marker already exists
      if (markersDataRef.current[sensorId]) {
        const { marker, status } = markersDataRef.current[sensorId];
        
        // If status changed, update marker color
        if (status !== newStatus) {
          console.log(`Updating marker for sensor ${sensorId} from ${status} to ${newStatus}`);
          marker.setStyle({
            color: markerColor,
            fillColor: markerColor
          });
          
          // Update the status in our ref
          markersDataRef.current[sensorId].status = newStatus;
        }
        
        // Update popup content with latest readings
        marker.setPopupContent(
          `<div class="p-2">
            <h3 class="font-bold">${sensor.name}</h3>
            <p class="text-sm">Status: ${getStatusLabel(newStatus)}</p>
            <p class="text-sm">Temperature: ${sensor.readings.temperature.toFixed(1)}°C</p>
            <p class="text-sm">pH: ${sensor.readings.ph.toFixed(1)}</p>
            <p class="text-sm">Oxygen: ${sensor.readings.oxygenLevel.toFixed(1)} mg/L</p>
          </div>`
        );
      }
      // Create new marker if it doesn't exist
      else {
        const marker = L.circleMarker([sensor.location.lat, sensor.location.lng], {
          radius: 6,
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: 0.8,
          weight: 2
        }).addTo(map.current);

        marker.bindPopup(
          `<div class="p-2">
            <h3 class="font-bold">${sensor.name}</h3>
            <p class="text-sm">Status: ${getStatusLabel(newStatus)}</p>
            <p class="text-sm">Temperature: ${sensor.readings.temperature.toFixed(1)}°C</p>
            <p class="text-sm">pH: ${sensor.readings.ph.toFixed(1)}</p>
            <p class="text-sm">Oxygen: ${sensor.readings.oxygenLevel.toFixed(1)} mg/L</p>
          </div>`
        );

        marker.bindTooltip(sensor.name, {
          permanent: false,
          direction: 'top'
        });

        marker.on('click', () => {
          navigate(`/sensors/${sensor.id}`);
        });
        
        // Save the marker reference
        markersRef.current.push(marker);
        markersDataRef.current[sensorId] = { marker, status: newStatus };
      }
    });
    
    // Fit bounds to show all markers if there are multiple
    if (sensors.length > 1 && map.current) {
      const bounds = L.latLngBounds(sensors.map(s => [s.location.lat, s.location.lng]));
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [navigate, sensors, initialized]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default SensorMap;