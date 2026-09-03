import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Address,
  GymTier,
  UpdateGymStatusCommand,
  UpdateMyGymStatusCommand,
} from "@api/types.ts";
import { toast } from "sonner";
import { gymKeys } from "./useGetGyms.ts";
import api from "../../api/api.ts";
import { useAuth } from "../user/useAuth.ts";

export const useUpdateGymStatus = () => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (command: UpdateGymStatusCommand) => {
      return await api.updateGymStatus(command.gymId, command);
    },

    onSuccess: () => {
      toast.success(t("GymStatusUpdatedToast"));

      queryClient.invalidateQueries({ queryKey: gymKeys.gyms });
    },
  });
};

export const useUpdateMyGymStatus = () => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  const { user } = useAuth();

  return useMutation({
    mutationFn: async (command: UpdateMyGymStatusCommand) => {
      return await api.updateMyGymStatus(command);
    },

    onSuccess: () => {
      toast.success(t("GymStatusUpdatedToast"));

      queryClient.invalidateQueries({ queryKey: gymKeys.gyms });
      queryClient.invalidateQueries({ queryKey: gymKeys.gym(user!.gymId!) });
    },
  });
};

export const useUpdateMyGymProfile = () => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      newName,
      newAddress,
      newTier,
    }: {
      newName: string;
      newAddress: Address;
      newTier: GymTier;
    }) => {
      const command = {
        newName,
        newAddress,
        newTier,
      };

      return await api.updateMyGymProfile(command as any);
    },

    onSuccess: () => {
      toast.success(t("GymProfileUpdatedToast"));

      queryClient.invalidateQueries({ queryKey: gymKeys.gyms });
      queryClient.invalidateQueries({ queryKey: gymKeys.gym(user!.gymId!) });
    },
  });
};
