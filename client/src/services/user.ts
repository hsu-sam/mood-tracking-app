import api from "./lib";
import type { MeResponse, OnboardingPayload } from "../types/user";

export const getMe = async () =>
  (await api.get<MeResponse>("/v1/users/me")).data.data.user;

export const completeOnboarding = async (body: OnboardingPayload) =>
  (await api.patch<MeResponse>("/v1/users/onboarding", body)).data.data.user;

export const uploadPhoto = async (photo: File) => {
  const formData = new FormData();
  formData.append("photo", photo);
  // Override the default JSON content type, otherwise axios serializes the
  // FormData to JSON. The browser then adds the multipart boundary itself.
  return (
    await api.patch<MeResponse>("/v1/users/update-me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data.data.user;
};
