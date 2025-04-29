import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAlerts } from "@/lib/mock-data";
import { AlertCircle, Info, AlertTriangle, Bell, X, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface AlertsListProps {
  fullPage?: boolean;
  className?: string;
}
const AlertsList = ({ fullPage = false, className }: AlertsListProps) => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const filteredAlerts = filter 
    ? alerts.filter(alert => alert.type === filter)
    : alerts;
  
  const alertsToShow = fullPage ? filteredAlerts : filteredAlerts.slice(0, 3);
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  const handleMarkAllAsRead = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAlerts([]);
      setIsLoading(false);
    }, 800);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">{t('recentAlerts')}</CardTitle>
          {filteredAlerts.length > 0 && (
            <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-medium">
              {filteredAlerts.length}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {fullPage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1.5 font-medium">
                  <Filter className="h-4 w-4" />
                  {filter ? t(filter) : t('filter')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44">
                <DropdownMenuLabel>{t('filterByType')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    onClick={() => setFilter(null)}
                    className={!filter ? "bg-accent text-accent-foreground" : ""}
                  >
                    {t('all')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilter('error')}
                    className={filter === 'error' ? "bg-accent text-accent-foreground" : ""}
                  >
                    <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                    {t('error')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilter('warning')}
                    className={filter === 'warning' ? "bg-accent text-accent-foreground" : ""}
                  >
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    {t('warning')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilter('info')}
                    className={filter === 'info' ? "bg-accent text-accent-foreground" : ""}
                  >
                    <Info className="h-4 w-4 text-blue-500 mr-2" />
                    {t('info')}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {fullPage && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 font-medium"
              onClick={handleMarkAllAsRead}
              disabled={isLoading || alerts.length === 0}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
              {t('markAllRead')}
            </Button>
          )}
          
          {fullPage && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <Loader2 className={cn("h-4.5 w-4.5", isLoading && "animate-spin")} />
              <span className="sr-only">{t('refresh')}</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={fullPage ? "p-0" : ""}>
        <div className={cn(
          "space-y-4", 
          fullPage && "max-h-[70vh] overflow-auto p-6 pt-2"
        )}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-70" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">{t('loading')}</p>
            </div>
          ) : alertsToShow.length > 0 ? (
            <AnimatePresence initial={false} mode="popLayout">
              {alertsToShow.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex items-center space-x-4 rounded-lg border p-4 pr-12 relative transition-all hover:bg-accent/50 shadow-soft",
                    alert.type === 'error' && "border-destructive/50 bg-destructive/5",
                    alert.type === 'warning' && "border-yellow-500/50 bg-yellow-500/5",
                    alert.type === 'info' && "border-blue-500/50 bg-blue-500/5"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    alert.type === 'error' && "bg-destructive/10",
                    alert.type === 'warning' && "bg-yellow-500/10",
                    alert.type === 'info' && "bg-blue-500/10"
                  )}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-tight">{alert.message}</p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-2 top-2 h-7 w-7 opacity-70 hover:opacity-100 hover:bg-accent"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">{t('dismiss')}</span>
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Bell className="h-7 w-7 text-primary opacity-80" />
              </div>
              <h3 className="mt-4 text-base font-medium">{t('noAlerts')}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-[250px]">
                {t('allSystemsRunning')}
              </p>
              {fullPage && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-6"
                  onClick={handleRefresh}
                >
                  {t('refreshAlerts')}
                </Button>
              )}
            </div>
          )}
        </div>
        
        {!fullPage && filteredAlerts.length > 3 && (
          <div className="mt-5 text-center">
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => navigate('/alerts')}
              className="font-medium text-primary"
            >
              {t('viewAllAlerts', { count: filteredAlerts.length })}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsList;