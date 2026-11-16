import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMood, getAverages, getRecent, getToday } from "../services/mood";
import type { HomeState } from "../types/mood";

// Local calendar date (not UTC), since "today" is the user's day.
export const localDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const useToday = () => {
  const date = localDate();
  return useQuery({
    queryKey: ["mood", "today", date],
    queryFn: () => getToday(date),
  });
};

export const useRecent = () =>
  useQuery({ queryKey: ["mood", "recent"], queryFn: getRecent });

export const useAverages = () =>
  useQuery({ queryKey: ["mood", "averages"], queryFn: getAverages });

export function useHomeState() {
  const today = useToday();
  const recent = useRecent();

  const isLoading = today.isLoading || recent.isLoading;
  const state: HomeState = today.data?.entry
    ? "logged"
    : (recent.data?.length ?? 0) > 0
      ? "pending"
      : "empty";

  return { state, isLoading, today: today.data, recent: recent.data };
}

export const useCreateMood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMood,
    // Refreshes today, recent (chart) and averages in one go
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mood"] }),
  });
};
