import api from "./lib";
import type {
  AveragesResponse,
  CreateMoodPayload,
  MoodEntry,
  RecentResponse,
  TodayResponse,
} from "../types/mood";

export const getToday = async (date: string) =>
  (await api.get<TodayResponse>("/v1/moods/today", { params: { date } })).data;

export const getRecent = async () =>
  (await api.get<RecentResponse>("/v1/moods/recent")).data.results;

export const getAverages = async () =>
  (await api.get<AveragesResponse>("/v1/moods/averages")).data;

export const createMood = async (body: CreateMoodPayload) =>
  (await api.post<{ entry: MoodEntry; quote: string }>("/v1/moods", body)).data;
