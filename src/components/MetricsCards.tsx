import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplet, Wind, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { useWebSocket } from "@/lib/websocket-context";
import { Node } from "@/lib/api-service";

const MetricsCards = () => {
  const { latestReadings } = useWebSocket();
  const [avgTemp, setAvgTemp] = useState(0);
  const [avgPH, setAvgPH] = useState(0);
  const [avgOxygen, setAvgOxygen] = useState(0);
  
  // Get all active nodes from the WebSocket context
  const activeNodes = useMemo(() => {
    return Object.values(latestReadings).filter((node): node is Node => node !== null);
  }, [latestReadings]);
  
  // Calculate averages when node data updates
  useEffect(() => {
    if (activeNodes.length === 0) return;
    
    // Calculate new averages directly from the real-time data
    const newAverages = activeNodes.reduce(
      (acc, node) => {
        acc.temperature += node.temperature;
        acc.pH += node.ph;
        acc.oxygenLevel += node.dissolved_oxygen;
        return acc;
      },
      { temperature: 0, pH: 0, oxygenLevel: 0 }
    );
    
    const count = activeNodes.length;
    setAvgTemp(newAverages.temperature / count);
    setAvgPH(newAverages.pH / count);
    setAvgOxygen(newAverages.oxygenLevel / count);
  }, [activeNodes]);
  
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

  const tempStatus = getTemperatureStatus(avgTemp);
  const phStatus = getpHStatus(avgPH);
  const oxyStatus = getOxygenStatus(avgOxygen);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="overflow-hidden shadow-soft card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
          <CardTitle className="text-base font-semibold">Avg Temperature</CardTitle>
          <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
            <Thermometer className="h-5 w-5 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold">{avgTemp.toFixed(1)}°C</div>
            <div className={cn("flex items-center text-sm font-medium", tempStatus.color)}>
              <tempStatus.icon className="h-4 w-4 mr-1.5" />
              {tempStatus.trend}%
            </div>
          </div>
          <Progress className="h-1.5 mt-4" value={avgTemp * 2.5} />
          <div className="mt-2.5 flex justify-between text-xs text-muted-foreground font-medium">
            <div>Cold</div>
            <div>Optimal</div>
            <div>Hot</div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-soft card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
          <CardTitle className="text-base font-semibold">Avg pH Level</CardTitle>
          <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/20">
            <Droplet className="h-5 w-5 text-indigo-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold">{avgPH.toFixed(1)}</div>
            <div className={cn("flex items-center text-sm font-medium", phStatus.color)}>
              <phStatus.icon className="h-4 w-4 mr-1.5" />
              {phStatus.trend}%
            </div>
          </div>
          <Progress className="h-1.5 mt-4" value={avgPH * 10} />
          <div className="mt-2.5 flex justify-between text-xs text-muted-foreground font-medium">
            <div>Acidic</div>
            <div>Neutral</div>
            <div>Alkaline</div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-soft card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
          <CardTitle className="text-base font-semibold">Avg Oxygen Level</CardTitle>
          <div className="p-1.5 rounded-md bg-cyan-50 dark:bg-cyan-900/20">
            <Wind className="h-5 w-5 text-cyan-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold">{avgOxygen.toFixed(1)} mg/L</div>
            <div className={cn("flex items-center text-sm font-medium", oxyStatus.color)}>
              <oxyStatus.icon className="h-4 w-4 mr-1.5" />
              {oxyStatus.trend}%
            </div>
          </div>
          <Progress className="h-1.5 mt-4" value={avgOxygen * 6} />
          <div className="mt-2.5 flex justify-between text-xs text-muted-foreground font-medium">
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