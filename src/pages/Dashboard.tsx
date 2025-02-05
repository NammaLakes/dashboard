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
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Lake Monitoring Dashboard</h1>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      
      <main className="container py-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <MetricsCards />
            <SensorMap />
          </div>
          <div className="space-y-6">
            <AlertsList />
            <SensorChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;