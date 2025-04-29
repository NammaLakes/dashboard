import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from 'lucide-react';
import Sidebar from '@/components/ui/navbar';
import AlertsList from '@/components/AlertsList';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Alerts = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

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

          <Tabs defaultValue="active" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">{t("Active Alerts")}</TabsTrigger>
              <TabsTrigger value="archived">{t("Archived Alerts")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{t("Alerts Overview")}</CardTitle>
                  <CardDescription>{t("Active and unresolved alerts in the system")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertsList fullPage showArchived={false} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="archived">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{t("Archived Alerts")}</CardTitle>
                  <CardDescription>{t("Resolved alerts are automatically archived and deleted after 24 hours")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertsList fullPage showArchived={true} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Alerts;
