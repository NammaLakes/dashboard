import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNodes, Node } from '@/lib/api-service';

interface SensorMapProps {
  singleMarker?: { lat: number; lng: number };
}

const SensorMap = ({ singleMarker }: SensorMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const navigate = useNavigate();

  // Only fetch nodes if we're showing multiple markers
  const { data: nodesData } = useQuery({
    queryKey: ['nodes'],
    queryFn: fetchNodes,
    enabled: !singleMarker, // Only run this query if we're not showing a single marker
    staleTime: 30000, // 30 seconds
  });

  // Transform API data into map markers
  const sensors = useMemo(() => {
    if (!nodesData) return [];
    
    return nodesData.data.map((node: Node) => ({
      id: node.node_id,
      name: `Sensor ${node.node_id}`,
      location: {
        lat: node.latitude,
        lng: node.longitude
      },
      status: node.maintenance_required === 0 ? 'active' : 'maintenance',
      readings: {
        temperature: node.temperature,
        ph: node.ph,
        oxygenLevel: node.dissolved_oxygen
      }
    }));
  }, [nodesData]);

  // Initialize map and add markers
  useEffect(() => {
    if (!mapContainer.current) return;

    // If map is already initialized, remove it first
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

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

    // Clear any existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

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
    } 
    // If showing all markers (for Dashboard)
    else if (sensors.length > 0) {
      sensors.forEach((sensor) => {
        const marker = L.circleMarker([sensor.location.lat, sensor.location.lng], {
          radius: 6,
          color: sensor.status === 'active' ? '#22c55e' : '#ef4444',
          fillColor: sensor.status === 'active' ? '#22c55e' : '#ef4444',
          fillOpacity: 0.8,
          weight: 2
        }).addTo(map.current);

        marker.bindPopup(
          `<div class="p-2">
            <h3 class="font-bold">${sensor.name}</h3>
            <p class="text-sm">Status: ${sensor.status}</p>
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
        
        markersRef.current.push(marker);
      });
      
      // Fit bounds to show all markers if there are multiple
      if (sensors.length > 1 && map.current) {
        const bounds = L.latLngBounds(sensors.map(s => [s.location.lat, s.location.lng]));
        map.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [navigate, singleMarker, sensors]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default SensorMap;