export type MoodValue = -2 | -1 | 0 | 1 | 2;
export type SleepValue = 1 | 3.5 | 5.5 | 7.5 | 9;

export interface MoodEntry {
  _id: string;
  entryDate: string; // YYYY-MM-DD
  mood: MoodValue;
  moodLabel: string;
  feelings: string[];
  sleepHours: SleepValue;
  sleepLabel: string;
  journal: string;
}

export interface TodayResponse {
  entry: MoodEntry | null;
  quote: string | null;
}

export interface RecentResponse {
  results: MoodEntry[];
}

export interface AveragePeriod {
  mood: number | null;
  sleep: number | null;
  count: number;
}

export interface AveragesResponse {
  current: AveragePeriod;
  previous: AveragePeriod;
}

// empty: no entries ever · pending: none today · logged: logged today
export type HomeState = "empty" | "pending" | "logged";

export interface CreateMoodPayload {
  entryDate: string;
  mood: MoodValue;
  feelings: string[];
  sleepHours: SleepValue;
  journal: string;
}
