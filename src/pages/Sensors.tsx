import { useAuth } from '@/lib/auth-context';
import { Button } from "@/components/ui/button";
import { LogOut, Search } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useWebSocket } from '@/lib/websocket-context';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuLink
} from '@/components/ui/sidebar';
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
  const { latestReadings } = useWebSocket();
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSensors = async () => {
      setLoading(true);
      try {
        // For now, we're using mock data
        const { mockSensors } = await import('@/lib/mock-data');
        setSensors(mockSensors);
      } catch (error) {
        console.error("Failed to fetch sensors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  // Filter sensors based on search query
  const filteredSensors = sensors.filter(sensor => 
    sensor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar defaultCollapsed={false} collapsible="icon">
        <SidebarHeader className="py-4">
          <h2 className="px-3 text-lg font-semibold tracking-tight">NammaLakes</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuLink to="/dashboard">Dashboard</SidebarMenuLink>
            </SidebarMenuItem>
            <SidebarMenuItem active>
              <SidebarMenuLink to="/sensors">Sensors</SidebarMenuLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuLink to="/alerts">
                {t("Alerts")}
              </SidebarMenuLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="py-2">
          <Button variant="ghost" onClick={logout} className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            {t("logout")}
          </Button>
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-col flex-1 w-full">

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("Sensors")}</h2>
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
          
          {loading ? (
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
                  const reading = latestReadings[sensor.id];
                  const isActive = !!reading;
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
                          {isActive ? t("active") : t("inactive")}
                        </span>
                      </TableCell>
                      <TableCell>{reading ? `${reading.temperature.toFixed(1)}°C` : 'N/A'}</TableCell>
                      <TableCell>{reading ? reading.pH.toFixed(1) : 'N/A'}</TableCell>
                      <TableCell>{reading ? `${reading.oxygenLevel.toFixed(1)} mg/L` : 'N/A'}</TableCell>
                      <TableCell>{reading ? new Date(reading.time).toLocaleString() : 'N/A'}</TableCell>
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