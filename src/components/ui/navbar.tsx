import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Globe } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    if (onNavigate) onNavigate(); // Close sidebar on mobile
  };

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold tracking-tight">NammaLakes</h2>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-auto">
        <nav className="space-y-1 px-2">
          <button
            onClick={() => {
              navigate("/dashboard");
              onNavigate?.();
            }}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 w-full text-left"
          >
            {t("Dashboard")}
          </button>
          <button
            onClick={() => {
              navigate("/sensors");
              onNavigate?.();
            }}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted w-full text-left"
          >
            {t("Sensors")}
          </button>
          <button
            onClick={() => {
              navigate("/alerts");
              onNavigate?.();
            }}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted w-full text-left"
          >
            {t("Alerts")}
          </button>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <Globe className="mr-2 h-4 w-4" />
              {t("language")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => changeLanguage("en")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("kn")}>
              ಕನ್ನಡ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("logout")}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
