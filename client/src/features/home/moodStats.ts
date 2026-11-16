import type { AveragePeriod } from "../../types/mood";

const MOOD_LABELS: Record<string, string> = {
  "-2": "Very Sad",
  "-1": "Sad",
  "0": "Neutral",
  "1": "Happy",
  "2": "Very Happy",
};

const SLEEP_BUCKETS = [
  { value: 1, label: "0-2 Hours" },
  { value: 3.5, label: "3-4 Hours" },
  { value: 5.5, label: "5-6 Hours" },
  { value: 7.5, label: "7-8 Hours" },
  { value: 9, label: "9+ Hours" },
];

export type Trend = "increase" | "decrease" | "same";

export const moodLabel = (avg: number) =>
  MOOD_LABELS[String(Math.round(avg))] ?? "Neutral";

// Snap the average to the closest sleep bucket
export const sleepLabel = (avg: number) =>
  SLEEP_BUCKETS.reduce((best, b) =>
    Math.abs(b.value - avg) < Math.abs(best.value - avg) ? b : best,
  ).label;

// null when there is nothing to compare against
export const trend = (
  current: number | null,
  previous: number | null,
): Trend | null => {
  if (current === null || previous === null) return null;
  const diff = current - previous;
  return Math.abs(diff) < 0.01 ? "same" : diff > 0 ? "increase" : "decrease";
};

// The design needs a full window of 5 check-ins to show an average
export const hasEnough = (p?: AveragePeriod) => (p?.count ?? 0) >= 5;
