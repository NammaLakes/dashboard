import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebSocket } from "@/lib/websocket-context";
import { useMemo } from "react";

interface SensorChartProps {
  sensorId?: string;
  title?: string;
  metric?: 'temperature' | 'pH' | 'oxygenLevel';
}

interface ChartDataPoint {
  time: string;
  value: number | null;
}

const SensorChart = ({ sensorId, title = "Sensor Readings", metric = 'temperature' }: SensorChartProps) => {
  const { historicalData } = useWebSocket();
  console.log(`SensorChart (${title || sensorId}): Historical Data:`, historicalData);
  console.log(`SensorChart (${title || sensorId}): Looking for sensorId:`, sensorId);

  const chartData: ChartDataPoint[] = useMemo(() => {
    const sensorHistory = sensorId ? historicalData[sensorId] : undefined;

    if (!sensorHistory) {
      if (!sensorId) {
        const allReadings = Object.values(historicalData).flat();
        if (!allReadings.length) return [];

        const aggregated = allReadings.reduce((acc, reading) => {
          const timeKey = new Date(reading.time).toLocaleTimeString();
          if (!acc[timeKey]) acc[timeKey] = { time: reading.time, sum: 0, count: 0 };
          acc[timeKey].sum += reading[metric] ?? 0;
          acc[timeKey].count++;
          return acc;
        }, {} as Record<string, { time: string, sum: number, count: number }>);

        return Object.values(aggregated).map(agg => ({
          time: agg.time,
          value: agg.count > 0 ? agg.sum / agg.count : null
        })).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      }
      return [];
    }

    return sensorHistory.map(reading => ({
      time: reading.time,
      value: reading[metric] ?? null,
    }));
  }, [historicalData, sensorId, metric]);

  const strokeColor = useMemo(() => {
    switch (metric) {
      case 'temperature': return '#2563eb';
      case 'pH': return '#16a34a';
      case 'oxygenLevel': return '#f97316';
      default: return '#8884d8';
    }
  }, [metric]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || `Sensor Readings: ${metric}`}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="time"
                tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                stroke="#888888"
                fontSize={10}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                domain={['auto', 'auto']}
                tickFormatter={(value) => typeof value === 'number' ? value.toFixed(1) : value}
              />
              <Tooltip
                contentStyle={{ fontSize: '12px', padding: '4px 8px' }}
                labelFormatter={(label) => new Date(label).toLocaleString()}
                formatter={(value: number | null, name, props) => [
                  value !== null ? `${value.toFixed(2)} ${metric === 'temperature' ? '°C' : metric === 'oxygenLevel' ? 'mg/L' : ''}` : 'N/A',
                  metric.charAt(0).toUpperCase() + metric.slice(1)
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
                dot={false}
                connectNulls={true}
                name={metric}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SensorChart;