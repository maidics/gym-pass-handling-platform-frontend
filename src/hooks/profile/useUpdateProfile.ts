import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { UpdateMyUserProfileCommand } from "@api/types.ts";
import api from "../../api/api.ts";
import { userKeys } from "../user/useAuth.ts";
import { toast } from "sonner";

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (command: UpdateMyUserProfileCommand) => {
      return await api.updateMyUserProfile(command);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.currentUser });

      toast.success(t("ProfileUpdated"));
    },
  });
};

export const useUpdateMyPreferredLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLanguage: string) => {
      return await api.updateMyPreferredLanguage(newLanguage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.currentUser });
    },
  });
};
