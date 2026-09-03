import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateGymPassProductCommand } from "@api/types.ts";
import api from "@api/api.ts";
import { gymPassProductKeys } from "@hooks/gymPassProducts/useGetGymPassProducts.ts";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "@hooks/user/useAuth.ts";
import { gymKeys } from "@hooks/gyms/useGetGyms.ts";

export const useCreateGymPassProduct = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (command: CreateGymPassProductCommand) => {
      return await api.createGymPassProduct(command as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gymPassProductKeys.gym(user!.gymId!),
      });

      queryClient.invalidateQueries({
        queryKey: gymKeys.gym(user!.gymId!),
      });

      toast.success(t("GymPassProductCreatedToast"));
    },
  });
};
