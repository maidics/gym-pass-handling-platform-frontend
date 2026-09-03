import { useAuth } from "@hooks/user/useAuth.ts";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FullScreenLoader } from "@components/dashboard/FullScreenLoader.tsx";

export function ProtectedGate() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated)
    return <Navigate to="/" state={{ from: location }} replace />;

  return <Outlet />;
}
