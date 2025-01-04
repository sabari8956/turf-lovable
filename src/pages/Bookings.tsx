import { useBooking } from "@/store/BookingContext";
import { Card, CardContent } from "@/components/ui/card";

export default function Bookings() {
  const { bookings } = useBooking();

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        <p className="text-secondary">You haven't made any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">My Bookings</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold mb-1">{booking.turfName}</h3>
                  <p className="text-sm text-secondary mb-2">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    Time: {booking.slotTime}
                  </p>
                </div>
                <div className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  Confirmed
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}