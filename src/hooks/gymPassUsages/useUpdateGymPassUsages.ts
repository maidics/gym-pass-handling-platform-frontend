import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@api/api.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { gymPassUsageKeys } from "@hooks/gymPassUsages/useGetGymPassUsages.ts";

export const useUpdateGymPassUsageLockerNumber = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gymPassUsageId,
      lockerNumber,
    }: {
      gymPassUsageId: string;
      lockerNumber: string;
    }) => {
      return await api.updateGymPassUsageLockerNumberCommand(
        gymPassUsageId,
        lockerNumber,
      );
    },
    onSuccess: () => {
      toast.success(t("GymPassUsageLockerNumberUpdatedToast"));

      queryClient.invalidateQueries({ queryKey: gymPassUsageKeys.myGymToday });
    },
  });
};

export const useGymEmployeeEndGymSession = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gymPassUsageId }: { gymPassUsageId: string }) => {
      return await api.gymEmployeeEndUserGymSession(gymPassUsageId);
    },
    onSuccess: () => {
      toast.success(t("GymEmployeeEndedGymSessionToast"));

      queryClient.invalidateQueries({ queryKey: gymPassUsageKeys.myGymToday });
    },
  });
};
