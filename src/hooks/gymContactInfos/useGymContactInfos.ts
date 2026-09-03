import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@api/api.ts";
import {
  CreateGymContactInfoCommand,
  UpdateGymContactInfoCommand,
} from "@api/types.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { gymKeys } from "@hooks/gyms/useGetGyms.ts";
import { useAuth } from "@hooks/user/useAuth.ts";

export const useCreateGymContactInfo = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (command: CreateGymContactInfoCommand) => {
      return await api.createGymContactInfo(command);
    },
    onSuccess: () => {
      toast.success(t("GymContactInfoCreatedToast"));

      queryClient.invalidateQueries({ queryKey: gymKeys.gym(user!.gymId!) });
    },
  });
};

export const useUpdateGymContactInfo = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (command: UpdateGymContactInfoCommand) => {
      return await api.updateGymContactInfo(command.gymContactInfoId, command);
    },
    onSuccess: () => {
      toast.success(t("GymContactInfoUpdatedToast"));

      queryClient.invalidateQueries({ queryKey: gymKeys.gym(user!.gymId!) });
    },
  });
};

export const useDeleteGymContactInfo = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ gymContactInfoId }: { gymContactInfoId: string }) => {
      return await api.deleteGymContactInfo(gymContactInfoId);
    },
    onSuccess: () => {
      toast.success(t("GymContactInfoDeletedToast"));

      queryClient.invalidateQueries({ queryKey: gymKeys.gym(user!.gymId!) });
    },
  });
};
