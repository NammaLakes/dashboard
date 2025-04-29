import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/ui/navbar";
import MetricsCards from "@/components/MetricsCards";
import AlertsList from "@/components/AlertsList";
import SensorMap from "@/components/SensorMap";
import { Menu } from "lucide-react";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const raf = requestAnimationFrame(() => {
        setIsLoaded(true);
      });
      return () => cancelAnimationFrame(raf);
    }
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
      <div className="hidden md:flex md:flex-col w-64 bg-card border-r border-border shrink-0 h-screen sticky top-0 overflow-auto shadow-soft">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        <main className="flex-1 p-5 md:p-6 lg:p-8 overflow-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">{t("dashboard")}</h2>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h2>
            <div className="flex space-x-2">
              {/* Header actions could go here */}
            </div>
          </div>

          {/* Metrics */}
          <div className="mb-8">
            <MetricsCards />
          </div>

          {/* Main dashboard content */}
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div
              ref={mapContainerRef}
              className="md:col-span-2 lg:col-span-3 bg-card rounded-lg shadow-soft border border-border"
              style={{ height: "650px" }}
            >
              {isLoaded && <SensorMap />}
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-lg shadow-soft border border-border overflow-hidden">
                <AlertsList />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;