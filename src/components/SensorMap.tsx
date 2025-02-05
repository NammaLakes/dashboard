import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockSensors } from '@/lib/mock-data';
import { useNavigate } from 'react-router-dom';

const SensorMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHNlOHB2NW0wMXZqMmtvNng2OWNyZXl6In0.qYDZhNjMEVF9QdO2yERpJA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [mockSensors[0].location.lng, mockSensors[0].location.lat],
      zoom: 12
    });

    mockSensors.forEach((sensor) => {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 rounded-full cursor-pointer';
      el.style.backgroundColor = sensor.status === 'active' ? '#22c55e' : 
                                sensor.status === 'warning' ? '#eab308' : '#ef4444';

      new mapboxgl.Marker(el)
        .setLngLat([sensor.location.lng, sensor.location.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${sensor.name}</h3>
            <p class="text-sm">Status: ${sensor.status}</p>
          </div>
        `))
        .addTo(map.current);

      el.addEventListener('click', () => {
        navigate(`/sensor/${sensor.id}`);
      });
    });

    return () => map.current?.remove();
  }, [navigate]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default SensorMap;