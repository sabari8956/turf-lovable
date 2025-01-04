import { useBooking } from "@/store/BookingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardBookings() {
  const { bookings, turfs } = useBooking();

  const getBookingDetails = (booking: any) => {
    const turf = turfs.find(t => t.id === booking.turfId);
    return {
      ...booking,
      turfName: turf?.name || "Unknown Turf",
      location: turf?.location || "Unknown Location",
    };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Bookings</h1>
      
      <div className="grid gap-4">
        {bookings.map(booking => {
          const details = getBookingDetails(booking);
          return (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle>{details.turfName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <p className="text-sm text-muted-foreground">
                    Location: {details.location}
                  </p>
                  <p className="text-sm">
                    Date: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm">Time: {booking.slotTime}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}