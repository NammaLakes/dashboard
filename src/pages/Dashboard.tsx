import { useAuth } from '@/lib/auth-context';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import SensorMap from '@/components/SensorMap';
import MetricsCards from '@/components/MetricsCards';
import AlertsList from '@/components/AlertsList';
import SensorChart from '@/components/SensorChart';

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Lake Monitoring Dashboard</h1>
          <Button variant="ghost" onClick={logout} className="flex items-center">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Metrics on top */}
          <div className="md:col-span-3">
            <MetricsCards />
          </div>

          {/* Map on left, alerts and chart on right */}
          <div className="md:col-span-2">
            <SensorMap />
          </div>

          <div className="space-y-4">
            <AlertsList />
            <SensorChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;