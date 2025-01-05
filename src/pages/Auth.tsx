import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to TurfBook</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in or create an account</p>
        </div>
        
        <Alert className="mb-6">
          <AlertDescription>
            Password requirements:
            <ul className="list-disc pl-4 mt-2 text-sm">
              <li>Minimum 6 characters long</li>
              <li>Can contain letters, numbers, and special characters</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            }
          }}
          theme="light"
          providers={[]}
          localization={{
            variables: {
              sign_up: {
                password_label: 'Password (minimum 6 characters)',
                email_label: 'Email address',
              }
            }
          }}
        />
      </div>
    </div>
  );
}