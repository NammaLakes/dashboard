import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAlerts } from "@/lib/mock-data";
import { AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const AlertsList = () => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "flex items-center space-x-4 rounded-lg border p-4",
                alert.type === 'error' && "border-destructive/50 bg-destructive/10",
                alert.type === 'warning' && "border-yellow-500/50 bg-yellow-500/10",
                alert.type === 'info' && "border-blue-500/50 bg-blue-500/10"
              )}
            >
              {getAlertIcon(alert.type)}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{alert.message}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsList;