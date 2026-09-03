import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@api/api.ts";
import { GymMembershipStatus } from "@api/types.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { gymMembershipKeys } from "@hooks/gymMemberships/useGetGymMemberships.ts";

export const useUpdateGymMembershipStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({
      gymMembershipId,
      newStatus,
    }: {
      gymMembershipId: string;
      newStatus: GymMembershipStatus;
    }) => {
      return await api.updateGymMembershipStatus(gymMembershipId, newStatus);
    },
    onSuccess: () => {
      toast.success(t("GymMembershipStatusUpdatedToast"));

      queryClient.invalidateQueries({ queryKey: gymMembershipKeys.myGym });
    },
  });
};
