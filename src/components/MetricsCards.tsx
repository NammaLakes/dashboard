import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplet, Wind, TrendingUp, TrendingDown } from "lucide-react";
import { mockSensors } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const MetricsCards = () => {
  const averages = mockSensors.reduce(
    (acc, sensor) => {
      acc.temperature += sensor.lastReading.temperature;
      acc.pH += sensor.lastReading.pH;
      acc.oxygenLevel += sensor.lastReading.oxygenLevel;
      return acc;
    },
    { temperature: 0, pH: 0, oxygenLevel: 0 }
  );

  const count = mockSensors.length;
  
  const getTemperatureStatus = (value: number) => {
    if (value < 10) return { color: "text-blue-500", icon: TrendingDown, trend: -5 };
    if (value > 25) return { color: "text-red-500", icon: TrendingUp, trend: 8 };
    return { color: "text-green-500", icon: TrendingUp, trend: 3 };
  };
  
  const getpHStatus = (value: number) => {
    if (value < 6.5) return { color: "text-yellow-500", icon: TrendingDown, trend: -2 };
    if (value > 8.5) return { color: "text-red-500", icon: TrendingUp, trend: 5 };
    return { color: "text-green-500", icon: TrendingUp, trend: 1 };
  };
  
  const getOxygenStatus = (value: number) => {
    if (value < 5) return { color: "text-red-500", icon: TrendingDown, trend: -12 };
    if (value > 12) return { color: "text-yellow-500", icon: TrendingUp, trend: 4 };
    return { color: "text-green-500", icon: TrendingUp, trend: 2 };
  };
  
  const avgTemp = averages.temperature / count;
  const avgPH = averages.pH / count;
  const avgOxygen = averages.oxygenLevel / count;

  const tempStatus = getTemperatureStatus(avgTemp);
  const phStatus = getpHStatus(avgPH);
  const oxyStatus = getOxygenStatus(avgOxygen);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
          <Thermometer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{avgTemp.toFixed(1)}°C</div>
            <div className={cn("flex items-center text-sm", tempStatus.color)}>
              <tempStatus.icon className="h-4 w-4 mr-1" />
              {tempStatus.trend}%
            </div>
          </div>
          <Progress className="h-1 mt-3" value={avgTemp * 2.5} />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <div>Cold</div>
            <div>Optimal</div>
            <div>Hot</div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Avg pH Level</CardTitle>
          <Droplet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{avgPH.toFixed(1)}</div>
            <div className={cn("flex items-center text-sm", phStatus.color)}>
              <phStatus.icon className="h-4 w-4 mr-1" />
              {phStatus.trend}%
            </div>
          </div>
          <Progress className="h-1 mt-3" value={avgPH * 10} />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <div>Acidic</div>
            <div>Neutral</div>
            <div>Alkaline</div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Avg Oxygen Level</CardTitle>
          <Wind className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{avgOxygen.toFixed(1)} mg/L</div>
            <div className={cn("flex items-center text-sm", oxyStatus.color)}>
              <oxyStatus.icon className="h-4 w-4 mr-1" />
              {oxyStatus.trend}%
            </div>
          </div>
          <Progress className="h-1 mt-3" value={avgOxygen * 6} />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <div>Low</div>
            <div>Optimal</div>
            <div>High</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;