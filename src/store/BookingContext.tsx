import React, { createContext, useContext, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

interface TimeSlot {
  id: string;
  time: string;
  isBooked: boolean;
}

interface Turf {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  price: number;
  slots: TimeSlot[];
}

interface Booking {
  id: string;
  turfId: string;
  turfName: string;
  slotId: string;
  slotTime: string;
  bookingDate: string;
}

interface BookingContextType {
  turfs: Turf[];
  bookings: Booking[];
  bookSlot: (turfId: string, slotId: string) => void;
}

const MOCK_TURFS: Turf[] = [
  {
    id: "1",
    name: "Green Valley Turf",
    location: "123 Sports Complex, Downtown",
    image: "/placeholder.svg",
    description: "Premium artificial grass turf with floodlights",
    price: 100,
    slots: [
      { id: "1-1", time: "09:00 AM", isBooked: false },
      { id: "1-2", time: "10:00 AM", isBooked: false },
      { id: "1-3", time: "11:00 AM", isBooked: false },
      { id: "1-4", time: "12:00 PM", isBooked: false },
    ],
  },
  {
    id: "2",
    name: "Urban Sports Arena",
    location: "456 City Center, Uptown",
    image: "/placeholder.svg",
    description: "Indoor turf with climate control",
    price: 120,
    slots: [
      { id: "2-1", time: "02:00 PM", isBooked: false },
      { id: "2-2", time: "03:00 PM", isBooked: false },
      { id: "2-3", time: "04:00 PM", isBooked: false },
      { id: "2-4", time: "05:00 PM", isBooked: false },
    ],
  },
];

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [turfs, setTurfs] = useState<Turf[]>(MOCK_TURFS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { toast } = useToast();

  const bookSlot = useCallback((turfId: string, slotId: string) => {
    setTurfs((prevTurfs) => {
      const newTurfs = prevTurfs.map((turf) => {
        if (turf.id === turfId) {
          const slots = turf.slots.map((slot) => {
            if (slot.id === slotId) {
              if (slot.isBooked) {
                toast({
                  variant: "destructive",
                  title: "Slot already booked",
                  description: "Please select another time slot",
                });
                return slot;
              }
              return { ...slot, isBooked: true };
            }
            return slot;
          });
          return { ...turf, slots };
        }
        return turf;
      });

      const turf = newTurfs.find((t) => t.id === turfId);
      const slot = turf?.slots.find((s) => s.id === slotId);

      if (turf && slot && !slot.isBooked) {
        const newBooking: Booking = {
          id: `${Date.now()}`,
          turfId,
          turfName: turf.name,
          slotId,
          slotTime: slot.time,
          bookingDate: new Date().toISOString(),
        };

        setBookings((prev) => [...prev, newBooking]);

        toast({
          title: "Booking Confirmed!",
          description: `You've successfully booked ${turf.name} for ${slot.time}`,
        });
      }

      return newTurfs;
    });
  }, [toast]);

  return (
    <BookingContext.Provider value={{ turfs, bookings, bookSlot }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}