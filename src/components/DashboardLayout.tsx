import { DashboardNav } from "./DashboardNav";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-background px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Exit
            </Button>
          </div>
          <DashboardNav />
        </div>
      </div>
      <div className="flex-1 md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}