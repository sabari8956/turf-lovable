import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState<'normal' | 'host'>('normal');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
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

      if (profile) {
        setUserType(profile.user_type);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleBecomeHost = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({ user_type: 'host' })
      .eq('id', session.user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update profile. Please try again.",
      });
    } else {
      setUserType('host');
      toast({
        title: "Success",
        description: "You are now a host! You can start managing your turfs.",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Account Type</h3>
              <p className="text-sm text-muted-foreground">
                {userType === 'host' ? 'You are a host' : 'You are a normal user'}
              </p>
            </div>
            {userType === 'normal' && (
              <Button onClick={handleBecomeHost}>
                Become a Host
              </Button>
            )}
          </div>
          <div className="pt-4 border-t">
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}