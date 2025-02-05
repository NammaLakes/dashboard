import { useParams, Link } from 'react-router-dom';
import { mockSensors } from '@/lib/mock-data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Thermometer, Droplet, Wind, Activity, MapPin } from 'lucide-react';
import SensorChart from '@/components/SensorChart';
import SensorMap from '@/components/SensorMap';

const SensorDetail = () => {
  const { id } = useParams();
  const sensor = mockSensors.find(s => s.id === id);

  if (!sensor) {
    return (
      <div className="container py-6">
        <h1 className="text-xl font-bold">Sensor Not Found</h1>
        <Link to="/dashboard">
          <Button variant="link">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm mb-6">
        <div className="container flex items-center space-x-4 py-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">{sensor.name}</h1>
          <span className={`px-3 py-1 text-xs rounded-full ${
            sensor.status === 'active' ? 'bg-green-500/20 text-green-600' :
            sensor.status === 'warning' ? 'bg-yellow-500/20 text-yellow-600' :
            'bg-red-500/20 text-red-600'
          }`}>
            {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Sensor Details (Left Side) */}
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2">
              {/* Temperature */}
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sensor.lastReading.temperature.toFixed(1)}°C</div>
                </CardContent>
              </Card>

              {/* pH Level */}
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">pH Level</CardTitle>
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sensor.lastReading.pH.toFixed(1)}</div>
                </CardContent>
              </Card>

              {/* Oxygen Level */}
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Oxygen Level</CardTitle>
                  <Wind className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sensor.lastReading.oxygenLevel.toFixed(1)} mg/L</div>
                </CardContent>
              </Card>

              {/* Last Update */}
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
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
          </div>

          {/* Location Info (Right Side) */}
          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sensor Location</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">Lat: {sensor.location.lat}, lng: {sensor.location.lng}</p>
                <div className="h-60 rounded-lg overflow-hidden mt-2">
                  <SensorMap singleMarker={{ lat: sensor.location.lat, lng: sensor.location.lng }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Graphs (Bottom) */}
        <div className="space-y-6">
          <SensorChart sensorId={sensor.id} title="Temperature Trends" metric="temperature" />
          <SensorChart sensorId={sensor.id} title="pH Level Trends" metric="pH" />
          <SensorChart sensorId={sensor.id} title="Oxygen Level Trends" metric="oxygenLevel" />
        </div>
      </main>
    </div>
  );
};

export default SensorDetail;