export interface User {
  _id: string;
  email: string;
  fullName?: string;
  photo?: string;
  role?: "user" | "admin";
  createdAt?: string;
}

export interface OnboardingPayload {
  fullName: string;
}

export interface MeResponse {
  status: "success" | "fail";
  data: { user: User };
}
