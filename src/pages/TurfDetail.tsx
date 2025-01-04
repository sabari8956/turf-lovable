import { useParams } from "react-router-dom";
import { useBooking } from "@/store/BookingContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TurfDetail() {
  const { id } = useParams();
  const { turfs, bookSlot } = useBooking();
  const turf = turfs.find((t) => t.id === id);

  if (!turf) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Turf not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <img
          src={turf.image}
          alt={turf.name}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{turf.name}</h1>
          <p className="text-secondary mb-4">{turf.location}</p>
          <p className="text-gray-600">{turf.description}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {turf.slots.map((slot) => (
              <Card key={slot.id} className="p-4">
                <p className="text-sm font-medium mb-2">{slot.time}</p>
                <Button
                  onClick={() => bookSlot(turf.id, slot.id)}
                  disabled={slot.isBooked}
                  variant={slot.isBooked ? "secondary" : "default"}
                  className="w-full"
                >
                  {slot.isBooked ? "Booked" : "Book Now"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}