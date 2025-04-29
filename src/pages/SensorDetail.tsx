import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Thermometer, Droplet, Wind, Activity, MapPin } from 'lucide-react';
import SensorChart from '@/components/SensorChart';
import SensorMap from '@/components/SensorMap';
import { useTranslation } from "react-i18next";
import { useWebSocket } from '@/lib/websocket-context';
import { useEffect } from 'react';
import { fetchNodeData, fetchNodes } from '@/lib/api-service';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface Sensor {
  id: string;
  name: string;
  location: { lat: number; lng: number };
}

const SensorDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { latestReadings } = useWebSocket();

  // Fetch all nodes to get basic info for this node
  const { data: nodesData, isLoading: isLoadingNodes, error: nodesError } = useQuery({
    queryKey: ['nodes'],
    queryFn: fetchNodes,
    staleTime: 30000, // 30 seconds
  });

  // Fetch detailed data for this specific node
  const { data: nodeData, isLoading: isLoadingNodeData, error: nodeDataError } = useQuery({
    queryKey: ['node', id],
    queryFn: () => id ? fetchNodeData(id) : Promise.reject('No node ID provided'),
    enabled: !!id, // Only run query if we have an ID
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refresh every minute
  });

  // Find the node details
  const currentNode = nodesData?.data.find(node => node.node_id === id);
  
  // Extract sensor information from the node data
  const sensor = currentNode ? {
    id: currentNode.node_id,
    name: `Sensor ${currentNode.node_id}`,
    location: {
      lat: currentNode.latitude, 
      lng: currentNode.longitude
    }
  } : null;

  // Get the latest reading
  const latestReading = currentNode ? {
    temperature: currentNode.temperature,
    ph: currentNode.ph,
    oxygenLevel: currentNode.dissolved_oxygen,
    time: currentNode.datetime
  } : null;

  // Determine loading and error state
  const isLoading = isLoadingNodes || isLoadingNodeData;
  const error = nodesError || nodeDataError;

  // Show toast on error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch sensor data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error]);

  const sensorStatus = currentNode 
    ? currentNode.maintenance_required === 0 ? 'active' : 'maintenance' 
    : 'inactive';

  if (isLoading) {
    return <div className="container py-6">{t("loading")}...</div>;
  }

  if (error || !sensor) {
    return (
      <div className="container py-6">
        <h1 className="text-xl font-bold">{t("sensorNotFound")}</h1>
        <Link to="/dashboard">
          <Button variant="link">{t("backToDashboard")}</Button>
        </Link>
      </div>
    );
  }

  const statusColor = sensorStatus === 'active' ? 'bg-green-500/20 text-green-600' :
                      sensorStatus === 'inactive' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-red-500/20 text-red-600';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white shadow-sm mb-6">
        <div className="container flex items-center space-x-4 py-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">{sensor.name}</h1>
          <span className={`px-3 py-1 text-xs rounded-full ${statusColor}`}>
            {t(sensorStatus)}
          </span>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t("temperature")}</CardTitle>
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestReading ? `${latestReading.temperature.toFixed(1)}°C` : 'N/A'}
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t("pHLevel")}</CardTitle>
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestReading ? latestReading.ph.toFixed(1) : 'N/A'}
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t("oxygenLevel")}</CardTitle>
                  <Wind className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestReading ? `${latestReading.oxygenLevel.toFixed(1)} mg/L` : 'N/A'}
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{t("lastUpdate")}</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium">
                    {latestReading ? new Date(latestReading.time).toLocaleString() : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("sensorLocation")}</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{t("latitude")}: {sensor.location.lat.toFixed(4)}, {t("longitude")}: {sensor.location.lng.toFixed(4)}</p>
                <div className="h-60 rounded-lg overflow-hidden mt-2">
                  <SensorMap singleMarker={{ lat: sensor.location.lat, lng: sensor.location.lng }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <SensorChart 
            sensorId={sensor.id} 
            title={t("temperatureTrends")} 
            metric="temperature" 
            data={nodeData?.data || []} 
          />
          <SensorChart 
            sensorId={sensor.id} 
            title={t("pHLevelTrends")} 
            metric="ph" 
            data={nodeData?.data || []} 
          />
          <SensorChart 
            sensorId={sensor.id} 
            title={t("oxygenLevelTrends")} 
            metric="dissolved_oxygen" 
            data={nodeData?.data || []} 
          />
        </div>
      </main>
    </div>
  );
};

export default SensorDetail;