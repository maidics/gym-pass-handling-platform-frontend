import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import i18n from "../../i18n.ts";
import { useEffect } from "react";
import { authUtils, getNavigationPathByRole } from "@lib/authUtils.ts";
import api from "../../api/api.ts";
import { Role } from "@constants/roles.ts";
import { useTranslation } from "react-i18next";
import {
  ActivateUserAccountCommand,
  LogInUserCommand,
  RegisterUserCommand,
  ResetPasswordCommand,
  UserDto,
} from "@api/types.ts";

export const userKeys = {
  currentUser: ["currentUser"] as const,
};

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAuthSuccess = async (token: any, delay: number = 0) => {
    if (token && token.accessToken) {
      setTimeout(async () => {
        authUtils.setToken(token);
        await queryClient.invalidateQueries({ queryKey: userKeys.currentUser });

        const pathToNavigate = getNavigationPathByRole(isInRole, user!);

        navigate(pathToNavigate);
      }, delay);
    }
  };

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<UserDto | null>({
    queryKey: userKeys.currentUser,
    queryFn: async () => {
      if (!authUtils.getToken()) {
        return null;
      }

      return await api.getMyUser();
    },
    retry: (failureCount, error: any) => {
      if (error?.message.status === 401) return false;
      return failureCount < 2;
    },
  });

  useEffect(() => {
    if (user?.preferredLanguage) {
      if (i18n.language !== user.preferredLanguage) {
        i18n.changeLanguage(user.preferredLanguage);
      }
    }
  }, [user]);

  const loginMutation = useMutation({
    mutationFn: async (command: LogInUserCommand) => {
      return await api.logInUser(command);
    },
    onSuccess: (data) => {
      handleAuthSuccess(data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (command: RegisterUserCommand) => {
      return await api.registerUser(command);
    },
    onSuccess: (token) => {
      handleAuthSuccess(token);
    },
  });

  const logout = () => {
    authUtils.removeToken();

    navigate("/");

    queryClient.removeQueries();
  };

  const sendEmailConfirmationMutation = useMutation({
    mutationFn: async () => {
      return await api.sendEmailConfirmationEmail();
    },
    onSuccess: () => {
      toast.success(t("ConfirmationEmailSent"));
    },
  });

  const isInRole = (role: Role): boolean =>
    user?.roles?.includes(role) ?? false;

  const accountActivationMutation = useMutation({
    mutationFn: async (command: ActivateUserAccountCommand) => {
      return await api.activateUserAccount(command);
    },
    onSuccess: (token) => {
      handleAuthSuccess(token, 3000);

      toast.success(t("AccountActivated"));

      queryClient.invalidateQueries({ queryKey: userKeys.currentUser });
    },
  });

  const passwordResetMutation = useMutation({
    mutationFn: async (command: ResetPasswordCommand) => {
      return await api.resetPassword(command);
    },
    onSuccess: (token) => {
      toast.success(t("PasswordUpdatedToast"));

      handleAuthSuccess(token, 3000);

      queryClient.invalidateQueries({ queryKey: userKeys.currentUser });
    },
  });

  const isManagedGym = (gymId: string | undefined) => {
    return !!user && !!gymId && gymId === user.gymId;
  };

  return {
    user,
    isInRole,
    isManagedGym,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      accountActivationMutation.isPending ||
      passwordResetMutation.isPending,
    isSuccess:
      loginMutation.isSuccess ||
      accountActivationMutation.isSuccess ||
      registerMutation.isSuccess ||
      passwordResetMutation.isSuccess,
    isAuthenticated: !!user,
    error,
    login: loginMutation,
    register: registerMutation,
    logout,
    sendEmailConfirmation: sendEmailConfirmationMutation.mutateAsync,
    activateAccount: accountActivationMutation.mutateAsync,
    resetPassword: passwordResetMutation.mutateAsync,
  };
}
