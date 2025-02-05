import { useParams, Link } from 'react-router-dom';
import { mockSensors } from '@/lib/mock-data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Thermometer, Droplet, Wind, Activity } from 'lucide-react';
import SensorChart from '@/components/SensorChart';

const SensorDetail = () => {
  const { id } = useParams();
  const sensor = mockSensors.find(s => s.id === id);

  if (!sensor) {
    return (
      <div className="container py-6">
        <h1>Sensor not found</h1>
        <Link to="/dashboard">
          <Button variant="link">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{sensor.name}</h1>
          <span className={`px-2 py-1 rounded-full text-xs ${
            sensor.status === 'active' ? 'bg-green-500/20 text-green-500' :
            sensor.status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
            'bg-red-500/20 text-red-500'
          }`}>
            {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
          </span>
        </div>
      </header>
      
      <main className="container py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensor.lastReading.temperature.toFixed(1)}°C</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">pH Level</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensor.lastReading.pH.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Oxygen Level</CardTitle>
              <Wind className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sensor.lastReading.oxygenLevel.toFixed(1)} mg/L</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Update</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {new Date(sensor.lastReading.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <SensorChart 
          sensorId={sensor.id} 
          title={`${sensor.name} - Historical Data`}
        />
      </main>
    </div>
  );
};

export default SensorDetail;