export interface Sensor {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  type: string;
  status: 'active' | 'inactive' | 'warning';
  lastReading: {
    temperature: number;
    pH: number;
    oxygenLevel: number;
    timestamp: string;
  };
}

export const mockSensors: Sensor[] = [
  {
    id: '1',
    name: 'North Shore Sensor',
    location: { lat: 45.4215, lng: -75.6972 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 22.5,
      pH: 7.2,
      oxygenLevel: 8.5,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '2',
    name: 'Deep Water Sensor',
    location: { lat: 45.4235, lng: -75.6992 },
    type: 'Water Quality',
    status: 'warning',
    lastReading: {
      temperature: 18.5,
      pH: 6.8,
      oxygenLevel: 7.2,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '3',
    name: 'South Bay Sensor',
    location: { lat: 45.4195, lng: -75.6952 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 23.1,
      pH: 7.4,
      oxygenLevel: 8.1,
      timestamp: new Date().toISOString(),
    },
  },
];

export const generateTimeSeriesData = (hours: number = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
    data.push({
      time: time.toISOString(),
      temperature: 20 + Math.random() * 5,
      pH: 7 + (Math.random() - 0.5),
      oxygenLevel: 8 + Math.random() * 2,
    });
  }
  
  return data;
};

export const mockAlerts = [
  {
    id: '1',
    sensorId: '2',
    type: 'warning',
    message: 'pH levels above normal range',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    sensorId: '1',
    type: 'info',
    message: 'Maintenance scheduled',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: '3',
    sensorId: '3',
    type: 'error',
    message: 'Connection lost temporarily',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];