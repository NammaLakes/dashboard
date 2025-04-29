import { useAuth } from '@/lib/auth-context';
import { Button } from "@/components/ui/button";
import { LogOut, Bell, Settings, RefreshCcw, Search, Globe } from 'lucide-react';
import SensorMap from '@/components/SensorMap';
import MetricsCards from '@/components/MetricsCards';
import AlertsList from '@/components/AlertsList';
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); 
  const [isLoaded, setIsLoaded] = useState(false);
  const mapContainerRef = useRef(null);

  // Better approach to ensure map loads properly
  useEffect(() => {
    // Wait for DOM to be fully rendered
    if (mapContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM is painted before loading map
      const raf = requestAnimationFrame(() => {
        setIsLoaded(true);
      });
      
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng); // Save language choice to localStorage
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile-friendly sidebar */}
      <div className="flex flex-col w-64 bg-card border-r border-border shrink-0 md:block h-screen sticky top-0 overflow-auto">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold tracking-tight">NammaLakes</h2>
        </div>
        
        {/* Sidebar Content */}
        <div className="flex-1 py-4">
          <nav className="space-y-1 px-2">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 w-full text-left"
        >
          {t("Dashboard")}
        </button>
        <button 
          onClick={() => navigate('/sensors')} 
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted w-full text-left"
        >
          {t("Sensors")}
        </button>
        <button 
          onClick={() => navigate('/alerts')} 
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted w-full text-left"
        >
          {t("Alerts")}
        </button>
          </nav>
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          {/* Language Switcher */}
          <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <Globe className="mr-2 h-4 w-4" />
            {t("language")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => changeLanguage('en')}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage('kn')}>
            ಕನ್ನಡ
          </DropdownMenuItem>
        </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Logout Button */}
          <Button variant="ghost" onClick={logout} className="w-full justify-start">
        <LogOut className="mr-2 h-4 w-4" />
        {t("logout")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full">
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("dashboard")}</h2>
          </div>
          
          {/* Key metrics at the top */}
          <div className="mb-6">
            <MetricsCards />
          </div>
          
          {/* Main dashboard content */}
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {/* Map takes more space */}
            <div 
              ref={mapContainerRef} 
              className="md:col-span-2 lg:col-span-3"
              style={{ height: '650px' }} // Explicit height is important for Leaflet
            >
              {isLoaded && (
                <SensorMap 
                  title={t("sensorLocations")} 
                  className="h-full" 
                />
              )}
            </div>
            
            {/* Sidebar with alerts and mini chart */}
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