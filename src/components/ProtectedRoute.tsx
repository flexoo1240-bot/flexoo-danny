import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AppLoader from "./AppLoader";

// Routes that must remain reachable even when the Telegram gate is pending.

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
