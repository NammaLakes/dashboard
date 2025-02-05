import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockSensors } from '@/lib/mock-data';
import { useNavigate } from 'react-router-dom';

const SensorMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = L.map(mapContainer.current).setView(
      [mockSensors[0].location.lat, mockSensors[0].location.lng],
      12
    );
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map.current);

    mockSensors.forEach((sensor) => {
      const marker = L.circleMarker([sensor.location.lat, sensor.location.lng], {
        radius: 6,
        color: sensor.status === 'active' ? '#22c55e' : 
        sensor.status === 'warning' ? '#eab308' : '#ef4444',
        fillColor: sensor.status === 'active' ? '#22c55e' : 
                  sensor.status === 'warning' ? '#eab308' : '#ef4444',
        fillOpacity: 0.8
      }).addTo(map.current);

      marker.bindPopup(
        `<div class="p-2">
          <h3 class="font-bold">${sensor.name}</h3>
          <p class="text-sm">Status: ${sensor.status}</p>
        </div>`
      );

      marker.on('click', () => {
        navigate(`/sensor/${sensor.id}`);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [navigate]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default SensorMap;