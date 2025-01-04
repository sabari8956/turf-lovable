import { Link, useLocation } from "react-router-dom";

export function DashboardNav() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="space-y-1">
      <Link
        to="/dashboard"
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
          isActive("/dashboard") 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        Overview
      </Link>
      <Link
        to="/dashboard/turfs"
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
          isActive("/dashboard/turfs")
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        Manage Turfs
      </Link>
      <Link
        to="/dashboard/bookings"
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
          isActive("/dashboard/bookings")
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        Bookings
      </Link>
    </div>
  );
}