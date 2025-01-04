import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "@/store/BookingContext";
import { Navbar } from "@/components/Navbar";
import Home from "./pages/Home";
import TurfDetail from "./pages/TurfDetail";
import Bookings from "./pages/Bookings";

const App = () => (
  <BookingProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/turf/:id" element={<TurfDetail />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </BookingProvider>
);

export default App;