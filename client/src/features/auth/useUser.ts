import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/user";

export function useUser() {
  const hasToken = Boolean(localStorage.getItem("authToken"));

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    enabled: hasToken,
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    needsOnboarding: Boolean(user) && !user?.fullName?.trim(),
  };
}
