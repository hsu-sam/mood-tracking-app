import api from "./lib";
import type { MeResponse } from "../types/user";

export const getMe = async () =>
  (await api.get<MeResponse>("/v1/users/me")).data.data.user;
