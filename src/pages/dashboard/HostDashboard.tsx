import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TurfManager } from "@/components/turfs/TurfManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Turf } from "@/types/turfs";
import { Slot } from "@/types/slots";

export default function HostDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [slots, setSlots] = useState<Record<string, Slot[]>>({});
  const [newTurf, setNewTurf] = useState({ name: "", location: "" });

  useEffect(() => {
    checkHostStatus();
    fetchTurfs();
  }, []);

  const checkHostStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', session.user.id)
      .single();

    if (profile?.user_type !== 'host') {
      navigate("/");
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only hosts can access this page.",
      });
    }
  };

  const fetchTurfs = async () => {
    const { data: turfs, error } = await supabase
      .from('turfs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch turfs.",
      });
      return;
    }

    setTurfs(turfs);
    turfs.forEach(turf => fetchSlots(turf.id));
  };

  const fetchSlots = async (turfId: string) => {
    const { data: slots, error } = await supabase
      .from('slots')
      .select('*')
      .eq('turf_id', turfId)
      .order('start_time', { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch slots.",
      });
      return;
    }

    setSlots(prev => ({ ...prev, [turfId]: slots }));
  };

  const handleCreateTurf = async () => {
    if (!newTurf.name || !newTurf.location) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('turfs')
      .insert([{ ...newTurf, host_id: session.user.id }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create turf.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Turf created successfully.",
    });
    
    setNewTurf({ name: "", location: "" });
    fetchTurfs();
  };

  const handleDeleteTurf = async (turfId: string) => {
    const { error } = await supabase
      .from('turfs')
      .delete()
      .eq('id', turfId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete turf.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Turf deleted successfully.",
    });
    
    fetchTurfs();
  };

  const handleDeleteSlot = async (slotId: string, turfId: string) => {
    const { error } = await supabase
      .from('slots')
      .delete()
      .eq('id', slotId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete slot.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Time slot deleted successfully.",
    });
    
    fetchSlots(turfId);
  };

  const handleSlotAdded = (turfId: string) => {
    fetchSlots(turfId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Host Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Turf</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Turf</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newTurf.name}
                  onChange={(e) => setNewTurf({ ...newTurf, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newTurf.location}
                  onChange={(e) => setNewTurf({ ...newTurf, location: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateTurf}>Create Turf</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {turfs.map((turf) => (
          <TurfManager
            key={turf.id}
            turf={turf}
            slots={slots[turf.id] || []}
            onDeleteTurf={handleDeleteTurf}
            onSlotAdded={handleSlotAdded}
            onSlotDeleted={handleDeleteSlot}
          />
        ))}
      </div>
    </div>
  );
}