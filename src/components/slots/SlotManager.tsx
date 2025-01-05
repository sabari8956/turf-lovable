import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddTimeSlotForm } from "@/components/AddTimeSlotForm";
import { Card, CardContent } from "@/components/ui/card";
import { Slot } from "@/types/slots";

interface SlotManagerProps {
  turfId: string;
  slots: Slot[];
  onSlotAdded: (turfId: string) => void;
  onSlotDeleted: (slotId: string, turfId: string) => void;
}

export function SlotManager({ turfId, slots, onSlotAdded, onSlotDeleted }: SlotManagerProps) {
  const [isAddingSlot, setIsAddingSlot] = useState(false);

  return (
    <div className="space-y-4">
      {isAddingSlot ? (
        <AddTimeSlotForm 
          turfId={turfId} 
          onSlotAdded={() => {
            onSlotAdded(turfId);
            setIsAddingSlot(false);
          }} 
        />
      ) : (
        <Button onClick={() => setIsAddingSlot(true)} className="w-full">
          Add New Time Slot
        </Button>
      )}
      
      <div className="grid gap-2">
        {slots?.map((slot) => (
          <Card key={slot.id}>
            <CardContent className="flex justify-between items-center p-4">
              <span>
                {slot.start_time} - {slot.end_time}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onSlotDeleted(slot.id, turfId)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}