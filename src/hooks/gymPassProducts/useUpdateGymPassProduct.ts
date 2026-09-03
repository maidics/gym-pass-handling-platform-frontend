import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@api/api.ts";
import { gymPassProductKeys } from "@hooks/gymPassProducts/useGetGymPassProducts.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { UpdateGymPassProductCommand } from "@api/types.ts";
import { useAuth } from "@hooks/user/useAuth.ts";

export const useUpdateMyGymPassProductActiveStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      gymPassProductId,
      isActive,
    }: {
      gymPassProductId: string;
      isActive: boolean;
    }) => {
      return await api.updateGymPassProductActiveStatus(
        gymPassProductId,
        isActive,
      );
    },
    onSuccess: () => {
      toast.success(t("GymPassProductUpdatedToast"));

      queryClient.invalidateQueries({
        queryKey: gymPassProductKeys.gym(user!.gymId!),
      });
    },
  });
};

export const useUpdateGymPassProduct = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (command: UpdateGymPassProductCommand) => {
      return await api.updateGymPassProduct(command.gymPassProductId, command);
    },
    onSuccess: () => {
      toast.success(t("GymPassProductUpdatedToast"));

      queryClient.invalidateQueries({
        queryKey: gymPassProductKeys.gym(user!.gymId!),
      });
    },
  });
};
