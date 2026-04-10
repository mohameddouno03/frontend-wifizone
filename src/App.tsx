import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import Login from "@/pages/Login";
import ClientPayment from "@/pages/client/ClientPayment";
import OwnerDashboard from "@/pages/owner/OwnerDashboard";
import OwnerMikrotiks from "@/pages/owner/OwnerMikrotiks";
import OwnerUsers from "@/pages/owner/OwnerUsers";
import OwnerFinances from "@/pages/owner/OwnerFinances";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOwners from "@/pages/admin/AdminOwners";
import AdminMikrotiks from "@/pages/admin/AdminMikrotiks";
import AdminUsers from "@/pages/admin/AdminUsers";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: "admin" | "owner" }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) return <Navigate to={user?.role === "admin" ? "/admin" : "/owner"} replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated
          ? <Navigate to={user?.role === "admin" ? "/admin" : "/owner"} replace />
          : <Navigate to="/login" replace />
      } />
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === "admin" ? "/admin" : "/owner"} replace /> : <Login />} />
      <Route path="/pay" element={<ClientPayment />} />

      {/* Owner routes */}
      <Route path="/owner" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/owner/mikrotiks" element={<ProtectedRoute role="owner"><OwnerMikrotiks /></ProtectedRoute>} />
      <Route path="/owner/users" element={<ProtectedRoute role="owner"><OwnerUsers /></ProtectedRoute>} />
      <Route path="/owner/finances" element={<ProtectedRoute role="owner"><OwnerFinances /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/owners" element={<ProtectedRoute role="admin"><AdminOwners /></ProtectedRoute>} />
      <Route path="/admin/mikrotiks" element={<ProtectedRoute role="admin"><AdminMikrotiks /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
