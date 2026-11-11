export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
