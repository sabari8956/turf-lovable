import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddTimeSlotFormProps {
  turfId: string;
  onSlotAdded: () => void;
}

export function AddTimeSlotForm({ turfId, onSlotAdded }: AddTimeSlotFormProps) {
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const { toast } = useToast();

  const timeOptions = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 6; // Start from 6 AM
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both start and end times",
      });
      return;
    }

    if (startTime >= endTime) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "End time must be after start time",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("slots")
        .insert([{ turf_id: turfId, start_time: startTime, end_time: endTime }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Time slot added successfully",
      });

      // Reset form
      setStartTime("");
      setEndTime("");
      
      // Trigger refresh of slots list
      onSlotAdded();
    } catch (error) {
      console.error("Error adding time slot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add time slot. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Time Slot</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="start-time" className="text-sm font-medium">
                Start Time
              </label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="start-time">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="end-time" className="text-sm font-medium">
                End Time
              </label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="end-time">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add Time Slot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}