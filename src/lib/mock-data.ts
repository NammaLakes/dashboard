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
    name: 'Ulsoor Lake Sensor',
    location: { lat: 12.9843, lng: 77.6190 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 25.0,
      pH: 7.0,
      oxygenLevel: 8.0,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '2',
    name: 'Madiwala Lake Sensor',
    location: { lat: 12.9072, lng: 77.6101 },
    type: 'Water Quality',
    status: 'warning',
    lastReading: {
      temperature: 24.5,
      pH: 6.8,
      oxygenLevel: 7.5,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '3',
    name: 'Bellandur Lake Sensor',
    location: { lat: 12.9352, lng: 77.6650 },
    type: 'Water Quality',
    status: 'inactive',
    lastReading: {
      temperature: 26.0,
      pH: 7.2,
      oxygenLevel: 6.5,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '4',
    name: 'Varthur Lake Sensor',
    location: { lat: 12.9373, lng: 77.7505 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 25.5,
      pH: 7.1,
      oxygenLevel: 7.8,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '5',
    name: 'Agara Lake Sensor',
    location: { lat: 12.9279, lng: 77.6387 },
    type: 'Water Quality',
    status: 'warning',
    lastReading: {
      temperature: 24.0,
      pH: 6.9,
      oxygenLevel: 7.0,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '6',
    name: 'Sankey Tank Sensor',
    location: { lat: 13.0053, lng: 77.5695 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 25.2,
      pH: 7.3,
      oxygenLevel: 7.9,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '7',
    name: 'Hebbal Lake Sensor',
    location: { lat: 13.0350, lng: 77.5915 },
    type: 'Water Quality',
    status: 'inactive',
    lastReading: {
      temperature: 26.1,
      pH: 7.4,
      oxygenLevel: 6.7,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '8',
    name: 'Nagavara Lake Sensor',
    location: { lat: 13.0357, lng: 77.6200 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 25.3,
      pH: 7.0,
      oxygenLevel: 8.1,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '9',
    name: 'Kaikondrahalli Lake Sensor',
    location: { lat: 12.9081, lng: 77.6669 },
    type: 'Water Quality',
    status: 'warning',
    lastReading: {
      temperature: 24.7,
      pH: 6.7,
      oxygenLevel: 7.2,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '10',
    name: 'Puttenahalli Lake Sensor',
    location: { lat: 12.8879, lng: 77.5855 },
    type: 'Water Quality',
    status: 'inactive',
    lastReading: {
      temperature: 26.4,
      pH: 7.5,
      oxygenLevel: 6.4,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '11',
    name: 'Yediyur Lake Sensor',
    location: { lat: 12.9295, lng: 77.5704 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 25.1,
      pH: 7.2,
      oxygenLevel: 7.7,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '12',
    name: 'Kothanur Lake Sensor',
    location: { lat: 13.0581, lng: 77.6208 },
    type: 'Water Quality',
    status: 'warning',
    lastReading: {
      temperature: 24.6,
      pH: 6.9,
      oxygenLevel: 7.3,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '13',
    name: 'Horamavu Agara Lake Sensor',
    location: { lat: 13.0285, lng: 77.6586 },
    type: 'Water Quality',
    status: 'inactive',
    lastReading: {
      temperature: 26.2,
      pH: 7.3,
      oxygenLevel: 6.6,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '14',
    name: 'Doddanekundi Lake Sensor',
    location: { lat: 12.9698, lng: 77.6974 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 25.4,
      pH: 7.1,
      oxygenLevel: 7.6,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '15',
    name: 'Kaggadasapura Lake Sensor',
    location: { lat: 12.9840, lng: 77.6710 },
    type: 'Water Quality',
    status: 'warning',
    lastReading: {
      temperature: 24.8,
      pH: 6.8,
      oxygenLevel: 7.1,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '16',
    name: 'Chinnappanahalli Lake Sensor',
    location: { lat: 12.9565, lng: 77.7030 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 25.2,
      pH: 7.0,
      oxygenLevel: 7.5,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '17',
    name: 'Kalkere Lake Sensor',
    location: { lat: 13.0416, lng: 77.6713 },
    type: 'Water Quality',
    status: 'inactive',
    lastReading: {
      temperature: 26.1,
      pH: 7.2,
      oxygenLevel: 6.9,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '18',
    name: 'Dorekere Lake Sensor',
    location: { lat: 12.9089, lng: 77.5391 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 25.0,
      pH: 7.1,
      oxygenLevel: 8.0,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '19',
    name: 'Gottigere Lake Sensor',
    location: { lat: 12.8571, lng: 77.5775 },
    type: 'Water Quality',
    status: 'warning',
    lastReading: {
      temperature: 24.5,
      pH: 6.8,
      oxygenLevel: 7.2,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '20',
    name: 'Allalasandra Lake Sensor',
    location: { lat: 13.0804, lng: 77.5949 },
    type: 'Water Quality',
    status: 'inactive',
    lastReading: {
      temperature: 26.3,
      pH: 7.4,
      oxygenLevel: 6.6,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '21',
    name: 'Jakkur Lake Sensor',
    location: { lat: 13.0713, lng: 77.6061 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 25.3,
      pH: 7.0,
      oxygenLevel: 7.9,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '22',
    name: 'Hulimavu Lake Sensor',
    location: { lat: 12.8726, lng: 77.6081 },
    type: 'Water Quality',
    status: 'warning',
    lastReading: {
      temperature: 24.7,
      pH: 6.9,
      oxygenLevel: 7.3,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '23',
    name: 'Thavarekere Lake Sensor',
    location: { lat: 12.8901, lng: 77.6223 },
    type: 'Water Quality',
    status: 'inactive',
    lastReading: {
      temperature: 26.0,
      pH: 7.3,
      oxygenLevel: 6.8,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '24',
    name: 'Singasandra Lake Sensor',
    location: { lat: 12.8802, lng: 77.6316 },
    type: 'Water Quality',
    status: 'active',
    lastReading: {
      temperature: 25.1,
      pH: 7.2,
      oxygenLevel: 7.8,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: '25',
    name: 'Subramanyapura Lake Sensor',
    location: { lat: 12.8869, lng: 77.5478 },
    type: 'Water Quality',
    status: 'warning',
    lastReading: {
      temperature: 24.9,
      pH: 6.9,
      oxygenLevel: 7.1,
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
  }
];