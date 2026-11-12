import api from "./lib";
import type {
  LoginPayload,
  SignupPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthResponse,
  MessageResponse,
} from "../types/auth";

export const login = async (body: LoginPayload) =>
  (await api.post<AuthResponse>("/v1/users/login", body)).data;

export const signup = async (body: SignupPayload) =>
  (await api.post<MessageResponse>("/v1/users/signup", body)).data;

export const forgotPassword = async (body: ForgotPasswordPayload) =>
  (await api.post<MessageResponse>("/v1/users/forgot-password", body)).data;

export const resetPassword = async ({
  token,
  ...body
}: ResetPasswordPayload & { token: string }) =>
  (
    await api.patch<MessageResponse>(
      `/v1/users/reset-password/${encodeURIComponent(token)}`,
      body,
    )
  ).data;
