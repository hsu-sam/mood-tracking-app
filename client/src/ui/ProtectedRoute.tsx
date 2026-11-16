import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useUser } from "../features/auth/useUser";
import Spinner from "./Spinner";

type ProtectedRouteProps = {
  children: ReactNode;
  isOnboardingRoute?: boolean;
};

function ProtectedRoute({
  children,
  isOnboardingRoute = false,
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, needsOnboarding } = useUser();

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (needsOnboarding && !isOnboardingRoute)
    return <Navigate to="/onboarding" replace />;

  if (!needsOnboarding && isOnboardingRoute)
    return <Navigate to="/home" replace />;

  return children;
}

export default ProtectedRoute;
