import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from 'react-router-dom';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCollapsed?: boolean;
  collapsible?: boolean | "icon";
  onCollapsedChange?: (collapsed: boolean) => void;
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  active?: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, defaultCollapsed = false, collapsible = false, onCollapsedChange, children, ...props }, ref) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

    const handleToggleCollapse = () => {
      const newCollapsed = !collapsed;
      setCollapsed(newCollapsed);
      onCollapsedChange?.(newCollapsed);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col border-r bg-background h-screen",
          collapsed ? "w-[60px]" : "w-[240px]",
          "transition-all duration-300 ease-in-out",
          className
        )}
        {...props}
      >
        {children}
        {collapsible && (
          <div className="flex justify-center mt-auto mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleCollapse} 
              className={cn("h-8 w-8", collapsible === "icon" && "opacity-0 group-hover:opacity-100")}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          </div>
        )}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center px-4 py-2", className)}
      {...props}
    />
  )
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto", className)}
      {...props}
    />
  )
);
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-4 py-2", className)}
      {...props}
    />
  )
);
SidebarFooter.displayName = "SidebarFooter";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("space-y-1 px-2 py-2", className)}
      {...props}
    />
  )
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className, active, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "rounded-md",
        active && "bg-accent",
        className
      )}
      {...props}
    />
  )
);
SidebarMenuItem.displayName = "SidebarMenuItem";
const SidebarMenuLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<typeof Link>>(
  ({ className, children, ...props }, ref) => (
    <Link
      ref={ref}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent/50 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
);
SidebarMenuLink.displayName = "SidebarMenuLink";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuLink
};
