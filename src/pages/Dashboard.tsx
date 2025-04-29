import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/ui/navbar";
import MetricsCards from "@/components/MetricsCards";
import AlertsList from "@/components/AlertsList";
import SensorMap from "@/components/SensorMap";

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
      <div className="hidden md:flex md:flex-col w-64 bg-card border-r border-border shrink-0 h-screen sticky top-0 overflow-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
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
            <h2 className="text-xl font-bold">{t("dashboard")}</h2>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("dashboard")}</h2>
          </div>

          {/* Metrics */}
          <div className="mb-6">
            <MetricsCards />
          </div>

          {/* Main dashboard content */}
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            <div
              ref={mapContainerRef}
              className="md:col-span-2 lg:col-span-3"
              style={{ height: "650px" }}
            >
              {isLoaded && <SensorMap />}
            </div>
            <div className="space-y-15">
              <AlertsList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;