import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useAuth } from '@/lib/auth-context';
import { Button } from "@/components/ui/button";
import { LogOut, Bell, AlertTriangle, Filter, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import Sidebar from '@/components/ui/navbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample alert data - in a real app, this would come from an API
const sampleAlerts = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    level: "critical",
    message: "pH levels critically high at Bellandur Lake",
    location: "Bellandur Lake",
    parameter: "pH",
    value: 9.8,
    threshold: 8.5,
    resolved: false
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    level: "warning",
    message: "Dissolved oxygen below threshold at Ulsoor Lake",
    location: "Ulsoor Lake",
    parameter: "DO",
    value: 4.1,
    threshold: 5.0,
    resolved: false
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    level: "critical",
    message: "Turbidity extremely high at Hebbal Lake",
    location: "Hebbal Lake",
    parameter: "Turbidity",
    value: 56,
    threshold: 30,
    resolved: true
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    level: "warning",
    message: "Temperature rising at Sankey Tank",
    location: "Sankey Tank",
    parameter: "Temperature",
    value: 28.9,
    threshold: 28.0,
    resolved: true
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    level: "info",
    message: "Conductivity increasing at Varthur Lake",
    location: "Varthur Lake",
    parameter: "Conductivity",
    value: 890,
    threshold: 800,
    resolved: false
  }
];

const Alerts = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState(sampleAlerts);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  // Filter alerts based on search, status, and level
  useEffect(() => {
    let result = alerts;
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(alert => 
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.parameter.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status
    if (selectedStatus !== "all") {
      const isResolved = selectedStatus === "resolved";
      result = result.filter(alert => alert.resolved === isResolved);
    }
    
    // Filter by alert level
    if (selectedLevel !== "all") {
      result = result.filter(alert => alert.level === selectedLevel);
    }
    
    setFilteredAlerts(result);
  }, [alerts, searchQuery, selectedStatus, selectedLevel]);

  const resolveAlert = (id) => {
    setAlerts(currentAlerts => 
      currentAlerts.map(alert => 
        alert.id === id ? { ...alert, resolved: true } : alert
      )
    );
  };

  // This would fetch real alert data in a production app
  useEffect(() => {
    // fetchAlerts()
    //   .then(data => setAlerts(data))
    //   .catch(error => console.error('Failed to fetch alerts:', error));
  }, []);

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
            <h2 className="text-xl font-bold">{t("Alerts Monitoring")}</h2>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1 hidden md:block">
              <h2 className="text-2xl font-bold inline-flex items-center">
                {t("Alerts Monitoring")}
              </h2>
              <p className="text-muted-foreground">
                {t("Alerts Description")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                {t("Date Range")}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                {t("Export")}
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("Alerts Overview")}</CardTitle>
                    <CardDescription>{t("Alerts Overview Description")}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">{t("Critical")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm">{t("Warning")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">{t("Info")}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-sm text-muted-foreground">{t("Critical Alerts")}</div>
                    <div className="text-2xl font-bold">{alerts.filter(a => a.level === "critical" && !a.resolved).length}</div>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="text-sm text-muted-foreground">{t("Warning Alerts")}</div>
                    <div className="text-2xl font-bold">{alerts.filter(a => a.level === "warning" && !a.resolved).length}</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-sm text-muted-foreground">{t("Resolved Alerts")}</div>
                    <div className="text-2xl font-bold">{alerts.filter(a => a.resolved).length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t("All Alerts")}</CardTitle>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder={t("Search Alerts")}
                    className="w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={t("status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Statuses")}</SelectItem>
                      <SelectItem value="active">{t("Active")}</SelectItem>
                      <SelectItem value="resolved">{t("Resolved")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedLevel}
                    onValueChange={setSelectedLevel}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={t("level")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Levels")}</SelectItem>
                      <SelectItem value="critical">{t("Critical")}</SelectItem>
                      <SelectItem value="warning">{t("Warning")}</SelectItem>
                      <SelectItem value="info">{t("Info")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Timestamp")}</TableHead>
                    <TableHead>{t("Level")}</TableHead>
                    <TableHead>{t("Message")}</TableHead>
                    <TableHead>{t("Location")}</TableHead>
                    <TableHead>{t("Parameter")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(alert.timestamp, 'yyyy-MM-dd HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            alert.level === "critical" ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800" :
                            alert.level === "warning" ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800" :
                            "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800"
                          }
                        >
                          {t(alert.level)}
                        </Badge>
                      </TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>{alert.location}</TableCell>
                      <TableCell>
                        {alert.parameter}: {alert.value} (Threshold: {alert.threshold})
                      </TableCell>
                      <TableCell>
                        {alert.resolved ? 
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                            {t("resolved")}
                          </Badge> :
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800">
                            {t("active")}
                          </Badge>
                        }
                      </TableCell>
                      <TableCell>
                        {!alert.resolved && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            {t("resolve")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredAlerts.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  {t("noAlertsFound")}
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-between">
              <div className="text-sm text-muted-foreground">
                {t("Showing")} {filteredAlerts.length} {t("of")} {alerts.length} {t("alerts")}
              </div>
              {/* Pagination could go here in a real app */}
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Alerts;
