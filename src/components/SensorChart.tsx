import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWebSocket } from "@/lib/websocket-context";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Thermometer, Droplet, Wind } from "lucide-react";
import { SensorData } from "@/lib/api-service";

interface SensorChartProps {
  sensorId?: string;
  title?: string;
  metric?: 'temperature' | 'ph' | 'dissolved_oxygen';
  className?: string;
  data?: SensorData[];
}

interface ChartDataPoint {
  time: string;
  value: number | null;
}

const SensorChart = ({ 
  sensorId, 
  title = "Sensor Readings", 
  metric = 'temperature', 
  className, 
  data 
}: SensorChartProps) => {
  const { historicalData } = useWebSocket();

  const chartData: ChartDataPoint[] = useMemo(() => {
    // If API data is provided, use it instead of WebSocket data
    if (data && data.length > 0) {
      return data.map(reading => ({
        time: reading.datetime,
        value: reading[metric] ?? null,
      })).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    }
    
    // Otherwise, fall back to WebSocket data if available
    const sensorHistory = sensorId ? historicalData[sensorId] : undefined;

    if (!sensorHistory || sensorHistory.length === 0) {
      if (!sensorId) {
        const allReadings = Object.values(historicalData).flat();
        if (!allReadings.length) return [];

        // Aggregate readings from all sensors
        const aggregated = allReadings.reduce((acc, reading) => {
          const timeKey = new Date(reading.timestamp).toLocaleTimeString();
          if (!acc[timeKey]) acc[timeKey] = { time: reading.datetime || new Date(reading.timestamp).toISOString(), sum: 0, count: 0 };
          const value = reading[metric];
          if (value !== undefined && value !== null) {
            acc[timeKey].sum += value;
            acc[timeKey].count++;
          }
          return acc;
        }, {} as Record<string, { time: string, sum: number, count: number }>);

        return Object.values(aggregated)
          .map(agg => ({
            time: agg.time,
            value: agg.count > 0 ? agg.sum / agg.count : null
          }))
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      }
      return [];
    }

    return sensorHistory.map(reading => ({
      time: reading.datetime || new Date(reading.timestamp).toISOString(),
      value: reading[metric] ?? null,
    })).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }, [historicalData, sensorId, metric, data]);

  const metricConfig = useMemo(() => {
    switch (metric) {
      case 'temperature': 
        return {
          stroke: '#2563eb',
          fill: '#dbeafe',
          icon: Thermometer,
          label: 'Temperature',
          unit: '°C',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        };
      case 'ph': 
        return {
          stroke: '#16a34a',
          fill: '#dcfce7',
          icon: Droplet,
          label: 'pH Level',
          unit: '',
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
        };
      case 'dissolved_oxygen': 
        return {
          stroke: '#f97316',
          fill: '#fff7ed',
          icon: Wind,
          label: 'Oxygen Level',
          unit: 'mg/L',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        };
      default: 
        return {
          stroke: '#8884d8',
          fill: '#f5f3ff',
          icon: Thermometer,
          label: 'Reading',
          unit: '',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        };
    }
  }, [metric]);

  const MetricIcon = metricConfig.icon;
  
  // Get the latest reading for display in the header
  const latestValue = chartData.length > 0 ? chartData[chartData.length - 1]?.value : null;

  return (
    <Card className={cn("overflow-hidden shadow-soft", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">{title || `${metricConfig.label} Readings`}</CardTitle>
          {latestValue !== null && (
            <CardDescription className="text-sm">
              Latest: {latestValue.toFixed(1)}{metricConfig.unit}
            </CardDescription>
          )}
        </div>
        <div className={cn("p-1.5 rounded-md", metricConfig.bgColor)}>
          <MetricIcon className={cn("h-5 w-5", metricConfig.color)} />
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-6">
        <div className="h-[300px] w-full mt-2">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricConfig.stroke} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={metricConfig.stroke} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis
                  dataKey="time"
                  tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => typeof value === 'number' ? value.toFixed(1) : value}
                />
                <Tooltip
                  contentStyle={{ 
                    fontSize: '12px', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                    border: '1px solid #e2e8f0' 
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                  formatter={(value: number | null, name, props) => [
                    value !== null ? `${value.toFixed(2)} ${metricConfig.unit}` : 'N/A',
                    metricConfig.label
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={metricConfig.stroke}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#color${metric})`}
                  dot={false}
                  activeDot={{ r: 6, stroke: metricConfig.stroke, strokeWidth: 2, fill: 'white' }}
                  connectNulls={true}
                  name={metric}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorChart;