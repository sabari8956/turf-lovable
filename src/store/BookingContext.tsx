import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  bookSlot: (turfId: string, slotId: string) => Promise<void>;
  addTurf: (turf: Omit<Turf, "id">) => Promise<void>;
  removeTurf: (id: string) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { toast } = useToast();

  const fetchTurfs = async () => {
    try {
      const { data: turfData, error: turfError } = await supabase
        .from('turfs')
        .select(`
          id,
          name,
          location
        `)
        .order('created_at', { ascending: false });

      if (turfError) throw turfError;

      // Fetch slots for each turf
      const turfsWithSlots = await Promise.all(
        (turfData || []).map(async (turf) => {
          const { data: slots, error: slotsError } = await supabase
            .from('slots')
            .select('*')
            .eq('turf_id', turf.id);

          if (slotsError) throw slotsError;

          // Check if slots are booked
          const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('slot_id')
            .eq('status', 'confirmed');

          if (bookingsError) throw bookingsError;

          const bookedSlotIds = new Set(bookings?.map(b => b.slot_id));

          return {
            ...turf,
            image: "/placeholder.svg", // You might want to store this in Supabase storage later
            description: "A beautiful turf", // You might want to add this to the turfs table
            price: 100, // You might want to add this to the turfs table
            slots: slots?.map(slot => ({
              id: slot.id,
              time: `${slot.start_time} - ${slot.end_time}`,
              isBooked: bookedSlotIds.has(slot.id)
            })) || []
          };
        })
      );

      setTurfs(turfsWithSlots);
    } catch (error) {
      console.error('Error fetching turfs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch turfs. Please try again.",
      });
    }
  };

  const fetchBookings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          slot_id,
          slots (
            id,
            start_time,
            end_time,
            turfs (
              id,
              name
            )
          )
        `)
        .eq('user_id', session.user.id);

      if (bookingsError) throw bookingsError;

      const formattedBookings = bookingsData?.map(booking => ({
        id: booking.id,
        turfId: booking.slots?.turfs?.id || '',
        turfName: booking.slots?.turfs?.name || '',
        slotId: booking.slot_id,
        slotTime: `${booking.slots?.start_time} - ${booking.slots?.end_time}`,
        bookingDate: new Date().toISOString(), // You might want to add this to the bookings table
      })) || [];

      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchTurfs();
    fetchBookings();

    // Subscribe to changes
    const turfsSubscription = supabase
      .channel('turfs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'turfs' }, () => {
        fetchTurfs();
      })
      .subscribe();

    const bookingsSubscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      turfsSubscription.unsubscribe();
      bookingsSubscription.unsubscribe();
    };
  }, []);

  const bookSlot = useCallback(async (turfId: string, slotId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to book a slot.",
        });
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .insert([{
          user_id: session.user.id,
          slot_id: slotId,
          status: 'confirmed'
        }]);

      if (error) throw error;

      toast({
        title: "Booking Confirmed!",
        description: "Your slot has been booked successfully.",
      });

      await fetchBookings();
      await fetchTurfs();
    } catch (error) {
      console.error('Error booking slot:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book slot. Please try again.",
      });
    }
  }, [toast]);

  const addTurf = useCallback(async (newTurf: Omit<Turf, "id">) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to add a turf.",
        });
        return;
      }

      const { error } = await supabase
        .from('turfs')
        .insert([{
          name: newTurf.name,
          location: newTurf.location,
          host_id: session.user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Turf added successfully.",
      });

      await fetchTurfs();
    } catch (error) {
      console.error('Error adding turf:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add turf. Please try again.",
      });
    }
  }, [toast]);

  const removeTurf = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('turfs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Turf removed successfully.",
      });

      await fetchTurfs();
    } catch (error) {
      console.error('Error removing turf:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove turf. Please try again.",
      });
    }
  }, [toast]);

  return (
    <BookingContext.Provider value={{ turfs, bookings, bookSlot, addTurf, removeTurf }}>
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