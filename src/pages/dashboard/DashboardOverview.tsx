import { useBooking } from "@/store/BookingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardOverview() {
  const { turfs, bookings } = useBooking();
  
  const totalBookings = bookings.length;
  const totalTurfs = turfs.length;
  const totalSlots = turfs.reduce((acc, turf) => acc + turf.slots.length, 0);
  const availableSlots = turfs.reduce(
    (acc, turf) => acc + turf.slots.filter(slot => !slot.isBooked).length,
    0
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Turfs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTurfs}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSlots}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableSlots}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}