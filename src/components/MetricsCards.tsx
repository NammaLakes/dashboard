import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplet, Wind } from "lucide-react";
import { mockSensors } from "@/lib/mock-data";

const MetricsCards = () => {
  const averages = mockSensors.reduce((acc, sensor) => {
    acc.temperature += sensor.lastReading.temperature;
    acc.pH += sensor.lastReading.pH;
    acc.oxygenLevel += sensor.lastReading.oxygenLevel;
    return acc;
  }, { temperature: 0, pH: 0, oxygenLevel: 0 });

  const count = mockSensors.length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
          <Thermometer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(averages.temperature / count).toFixed(1)}°C</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg pH Level</CardTitle>
          <Droplet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(averages.pH / count).toFixed(1)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Oxygen Level</CardTitle>
          <Wind className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(averages.oxygenLevel / count).toFixed(1)} mg/L</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;