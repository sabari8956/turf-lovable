import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlotManager } from "@/components/slots/SlotManager";
import { Turf } from "@/types/turfs";
import { Slot } from "@/types/slots";

interface TurfManagerProps {
  turf: Turf;
  slots: Slot[];
  onDeleteTurf: (id: string) => void;
  onSlotAdded: (turfId: string) => void;
  onSlotDeleted: (slotId: string, turfId: string) => void;
}

export function TurfManager({ 
  turf, 
  slots, 
  onDeleteTurf, 
  onSlotAdded, 
  onSlotDeleted 
}: TurfManagerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{turf.name}</CardTitle>
          <Button
            variant="destructive"
            onClick={() => onDeleteTurf(turf.id)}
          >
            Delete Turf
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{turf.location}</p>
      </CardHeader>
      <CardContent>
        <SlotManager
          turfId={turf.id}
          slots={slots}
          onSlotAdded={onSlotAdded}
          onSlotDeleted={onSlotDeleted}
        />
      </CardContent>
    </Card>
  );
}