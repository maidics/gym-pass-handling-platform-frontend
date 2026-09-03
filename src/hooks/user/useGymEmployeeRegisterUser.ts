import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GymEmployeeRegisterUserCommand } from "@api/types.ts";
import api from "@api/api.ts";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { gymMembershipKeys } from "@hooks/gymMemberships/useGetGymMemberships.ts";
import { useNavigate } from "react-router-dom";

export const useGymEmployeeRegisterUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (command: GymEmployeeRegisterUserCommand) => {
      return await api.gymEmployeeRegisterUser(command);
    },
    onSuccess: () => {
      navigate("/gym-members");

      toast.success(t("GymEmployeeRegisteredUserToast"));

      queryClient.invalidateQueries({
        queryKey: gymMembershipKeys.myGym,
      });
    },
  });
};
