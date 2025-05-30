import { useAuth } from '@/lib/auth-context';
import { Button } from "@/components/ui/button";
import { LogOut, Search } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useWebSocket } from '@/lib/websocket-context';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import Sidebar from '@/components/ui/navbar';
import { Node } from '@/lib/api-service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Sensors = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { latestReadings, isPolling } = useWebSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Map the real-time node data to sensor objects for UI
  const sensors = useMemo(() => {
    return Object.values(latestReadings)
      .filter((node): node is Node => node !== null)
      .map((node: Node) => ({
        id: node.node_id,
        name: `Sensor ${node.node_id}`,
        location: `${node.latitude}, ${node.longitude}`,
        status: node.maintenance_required === 0 ? 'active' : 'maintenance',
        lastReading: {
          temperature: node.temperature,
          ph: node.ph,
          oxygenLevel: node.dissolved_oxygen,
          timestamp: node.datetime
        }
      }));
  }, [latestReadings]);

  // Filter sensors based on search query
  const filteredSensors = useMemo(() => {
    return sensors.filter(sensor => 
      sensor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sensors, searchQuery]);

  const isLoading = useMemo(() => {
    return sensors.length === 0 && isPolling;
  }, [sensors.length, isPolling]);

  return (
    <div className="flex min-h-screen bg-background">

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 h-full">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-card border-r border-border shrink-0 h-screen sticky top-0 overflow-auto">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-full">

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-muted"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold">{t("Sensors")}</h2>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold hidden md:block">{t("Sensors")}</h2>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              type="search"
              className="block w-full p-2 ps-10 text-sm rounded-lg"
              placeholder={t("Search Sensors")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <p>{t("loading")}...</p>
          ) : filteredSensors.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-lg text-muted-foreground mb-2">{t("noSensorsFound")}</p>
              <p className="text-sm text-muted-foreground">
                {t("tryDifferentSearch")}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("temperature")}</TableHead>
                  <TableHead>{t("pHLevel")}</TableHead>
                  <TableHead>{t("oxygenLevel")}</TableHead>
                  <TableHead>{t("lastUpdate")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSensors.map((sensor) => {
                  const isActive = sensor.status === 'active';
                  const statusColor = isActive ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600';
                  
                  return (
                    <TableRow 
                      key={sensor.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/sensors/${sensor.id}`)}
                    >
                      <TableCell className="font-medium">{sensor.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
                          {isActive ? t("active") : t("maintenance")}
                        </span>
                      </TableCell>
                      <TableCell>{`${sensor.lastReading.temperature.toFixed(1)}°C`}</TableCell>
                      <TableCell>{sensor.lastReading.ph.toFixed(1)}</TableCell>
                      <TableCell>{`${sensor.lastReading.oxygenLevel.toFixed(1)} mg/L`}</TableCell>
                      <TableCell>{new Date(sensor.lastReading.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </main>
      </div>
    </div>
  );
};

export default Sensors;