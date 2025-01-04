import { useState } from "react";
import { useBooking } from "@/store/BookingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ManageTurfs() {
  const { turfs, addTurf, removeTurf } = useBooking();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newTurf, setNewTurf] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
    image: "/placeholder.svg",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newTurf.price);
    
    if (!newTurf.name || !newTurf.location || !newTurf.description || isNaN(price)) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please fill in all fields correctly.",
      });
      return;
    }

    addTurf({
      ...newTurf,
      price,
      slots: [
        { id: "1", time: "09:00 AM", isBooked: false },
        { id: "2", time: "10:00 AM", isBooked: false },
        { id: "3", time: "11:00 AM", isBooked: false },
        { id: "4", time: "12:00 PM", isBooked: false },
      ],
    });

    setNewTurf({
      name: "",
      location: "",
      description: "",
      price: "",
      image: "/placeholder.svg",
    });
    setIsCreating(false);
    
    toast({
      title: "Success",
      description: "Turf has been created successfully.",
    });
  };

  const handleRemove = (id: string) => {
    const turf = turfs.find(t => t.id === id);
    const hasBookings = turf?.slots.some(slot => slot.isBooked);
    
    if (hasBookings) {
      toast({
        variant: "destructive",
        title: "Cannot Remove Turf",
        description: "This turf has active bookings and cannot be removed.",
      });
      return;
    }
    
    removeTurf(id);
    toast({
      title: "Success",
      description: "Turf has been removed successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Turfs</h1>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? "Cancel" : "Add New Turf"}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Turf</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newTurf.name}
                  onChange={e => setNewTurf(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newTurf.location}
                  onChange={e => setNewTurf(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTurf.description}
                  onChange={e => setNewTurf(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price per Hour</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTurf.price}
                  onChange={e => setNewTurf(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              
              <Button type="submit">Create Turf</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {turfs.map(turf => (
          <Card key={turf.id}>
            <CardHeader>
              <CardTitle>{turf.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{turf.location}</p>
              <p className="text-sm mb-4">{turf.description}</p>
              <p className="font-medium mb-4">${turf.price}/hour</p>
              <p className="text-sm mb-4">
                {turf.slots.filter(slot => !slot.isBooked).length} slots available
              </p>
              <Button
                variant="destructive"
                onClick={() => handleRemove(turf.id)}
              >
                Remove Turf
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}