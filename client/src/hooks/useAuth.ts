import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, signup, forgotPassword, resetPassword } from "../services/auth";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      queryClient.clear();
    },
  });
};

export const useSignup = () => {
  useMutation({ mutationFn: signup });
};

export const useForgotPassword = () => {
  useMutation({ mutationFn: forgotPassword });
};

export const useResetPassword = () => {
  useMutation({ mutationFn: resetPassword });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return () => {
    localStorage.removeItem("authToken");
    queryClient.clear();
  };
};
