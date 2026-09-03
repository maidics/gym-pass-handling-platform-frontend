import { useAuth } from "@hooks/user/useAuth.ts";
import { FullScreenLoader } from "@components/dashboard/FullScreenLoader.tsx";
import { Navigate, Outlet } from "react-router-dom";
import { getNavigationPathByRole } from "@lib/authUtils.ts";

export function PublicOnlyGate() {
  const { isLoading, isAuthenticated, isInRole, user } = useAuth();

  if (isLoading) return <FullScreenLoader />;
  if (isAuthenticated) {
    return <Navigate to={getNavigationPathByRole(isInRole, user!)} replace />;
  }

  return <Outlet />;
}
