import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  login,
  logout,
  signup,
  forgotPassword,
  resetPassword,
} from "../services/auth";
import { completeOnboarding, updateMe, uploadPhoto } from "../services/user";

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

export const useSignup = () => useMutation({ mutationFn: signup });

export const useForgotPassword = () =>
  useMutation({ mutationFn: forgotPassword });

export const useResetPassword = () =>
  useMutation({ mutationFn: resetPassword });

export const useOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      fullName,
      photo,
    }: {
      fullName: string;
      photo: File | null;
    }) => {
      if (photo) await uploadPhoto(photo);
      return completeOnboarding({ fullName });
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logout,
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onSettled: () => {
      localStorage.removeItem("authToken");
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
};
