import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  DemoteGymStaffToPendingGymEmployeeCommand,
  PromotePendingGymEmployeeToGymStaffRoleCommand,
  UpdateMyPasswordCommand,
} from "@api/types.ts";
import { gymEmploymentKeys } from "@hooks/gymEmployments/useGetGymEmployments.ts";

export const useUpdateMyPassword = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (command: UpdateMyPasswordCommand) => {
      return await api.updateMyPassword(command);
    },
    onSuccess: () => {
      toast.success(t("PasswordUpdatedToast"));
    },
  });
};

export const useSendAccountActivationEmail = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (email: string) => {
      return await api.sendAccountActivationEmail(email);
    },
    onSuccess: () => {
      toast.success(t("AccountActivationEmailSent"));
    },
  });
};

export const useSendPasswordResetEmail = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (email: string) => {
      return await api.sendPasswordResetEmail(email);
    },
    onSuccess: () => {
      toast.success(t("PasswordResetEmailSent"));
    },
  });
};

export const usePromotePendingGymEmployeeToGymStaff = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      command: PromotePendingGymEmployeeToGymStaffRoleCommand,
    ) => {
      return await api.promotePendingGymEmployeeToGymStaffRole(command);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gymEmploymentKeys.myGymEmployments,
      });

      toast.success(t("PendingGymEmployeePromotedToast"));
    },
  });
};

export const useDemoteGymStaffToPendingGymEmployee = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (command: DemoteGymStaffToPendingGymEmployeeCommand) => {
      return await api.demoteGymStaffToPendingGymEmployee(command);
    },
    onSuccess: () => {
      toast.success(t("GymStaffDemotedToast"));

      queryClient.invalidateQueries({
        queryKey: gymEmploymentKeys.myGymEmployments,
      });
    },
  });
};
