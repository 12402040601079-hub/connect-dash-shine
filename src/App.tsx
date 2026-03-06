import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import MicroLink from "@/components/MicroLink";
import SuperAdminApp from "@/pages/super-admin";

const queryClient = new QueryClient();

const isSuperAdminPath =
  typeof window !== "undefined" && window.location.pathname.startsWith("/super-admin");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        {isSuperAdminPath ? <SuperAdminApp /> : <MicroLink />}
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
