import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const location = useLocation();
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const checkHostStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const { data: profile } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      setIsHost(profile?.user_type === 'host');
    };

    checkHostStatus();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-primary">
            TurfBook
          </Link>
          <div className="flex gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-secondary"
              }`}
            >
              Home
            </Link>
            <Link
              to="/bookings"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/bookings" ? "text-primary" : "text-secondary"
              }`}
            >
              My Bookings
            </Link>
            {isHost && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith("/dashboard") ? "text-primary" : "text-secondary"
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/profile"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/profile" ? "text-primary" : "text-secondary"
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}