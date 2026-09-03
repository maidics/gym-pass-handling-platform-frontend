import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@api/api.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { gymPassUsageKeys } from "@hooks/gymPassUsages/useGetGymPassUsages.ts";

export const useGymEmployeeUseGymMembershipPass = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gymMembershipPassId,
      userId,
      lockerNumber,
    }: {
      gymMembershipPassId: string;
      userId: string;
      lockerNumber: string;
    }) => {
      return await api.gymEmployeeUseGymMembershipPass(
        userId,
        gymMembershipPassId,
        lockerNumber,
      );
    },
    onSuccess: () => {
      toast.success(t("PassAccepted"));

      queryClient.invalidateQueries({ queryKey: gymPassUsageKeys.myGymToday });
    },
  });
};

export const isGymMembershipPassValid = () => {
  return useMutation({
    mutationFn: async ({
      gymMembershipPassId,
    }: {
      gymMembershipPassId: string;
    }) => {
      return await api.isGymMembershipPassValid(gymMembershipPassId);
    },
  });
};
