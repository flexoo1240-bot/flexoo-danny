import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useTelegramGate } from "@/hooks/useTelegramGate";
import { useAdminCheck } from "@/hooks/useAdminCheck";

// Routes that must remain reachable even when the Telegram gate is pending.
const GATE_EXEMPT_PREFIXES = ["/telegram-join", "/admin", "/admin-login", "/signup-success"];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { loading: gateLoading, required, completed } = useTelegramGate();
  const { isAdmin, loading: adminLoading } = useAdminCheck();

  if (loading || gateLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const path = location.pathname;
  const isExempt = GATE_EXEMPT_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));

  if (required && !completed && !isAdmin && !isExempt) {
    return <Navigate to="/telegram-join" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
