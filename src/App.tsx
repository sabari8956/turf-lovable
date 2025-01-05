import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BookingProvider } from "@/store/BookingContext";
import { Navbar } from "@/components/Navbar";
import { DashboardLayout } from "@/components/DashboardLayout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import TurfDetail from "./pages/TurfDetail";
import Bookings from "./pages/Bookings";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import ManageTurfs from "./pages/dashboard/ManageTurfs";
import DashboardBookings from "./pages/dashboard/DashboardBookings";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Host Route component
const HostRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const checkHostStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      setIsHost(profile?.user_type === 'host');
      setLoading(false);
    };

    checkHostStatus();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isHost) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <BookingProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Home />
                  </>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Profile />
                  </>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/turf/:id"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <TurfDetail />
                  </>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Bookings />
                  </>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <HostRoute>
                    <DashboardLayout>
                      <DashboardOverview />
                    </DashboardLayout>
                  </HostRoute>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/turfs"
              element={
                <ProtectedRoute>
                  <HostRoute>
                    <DashboardLayout>
                      <ManageTurfs />
                    </DashboardLayout>
                  </HostRoute>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/bookings"
              element={
                <ProtectedRoute>
                  <HostRoute>
                    <DashboardLayout>
                      <DashboardBookings />
                    </DashboardLayout>
                  </HostRoute>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </BookingProvider>
);

export default App;