import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "@/store/BookingContext";
import { Navbar } from "@/components/Navbar";
import { DashboardLayout } from "@/components/DashboardLayout";
import Home from "./pages/Home";
import TurfDetail from "./pages/TurfDetail";
import Bookings from "./pages/Bookings";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import ManageTurfs from "./pages/dashboard/ManageTurfs";
import DashboardBookings from "./pages/dashboard/DashboardBookings";

const App = () => (
  <BookingProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                </>
              }
            />
            <Route
              path="/turf/:id"
              element={
                <>
                  <Navbar />
                  <TurfDetail />
                </>
              }
            />
            <Route
              path="/bookings"
              element={
                <>
                  <Navbar />
                  <Bookings />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <DashboardOverview />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/turfs"
              element={
                <DashboardLayout>
                  <ManageTurfs />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/bookings"
              element={
                <DashboardLayout>
                  <DashboardBookings />
                </DashboardLayout>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </BookingProvider>
);

export default App;