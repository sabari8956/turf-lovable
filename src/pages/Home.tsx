import { useBooking } from "@/store/BookingContext";
import { TurfCard } from "@/components/TurfCard";

export default function Home() {
  const { turfs } = useBooking();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2">Find Your Perfect Turf</h1>
      <p className="text-secondary text-center mb-12">Book premium sports facilities in your area</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {turfs.map((turf) => (
          <TurfCard
            key={turf.id}
            id={turf.id}
            name={turf.name}
            location={turf.location}
            image={turf.image}
            description={turf.description}
            price={turf.price}
            availableSlots={turf.slots.filter(slot => !slot.isBooked).length}
          />
        ))}
      </div>
    </div>
  );
}