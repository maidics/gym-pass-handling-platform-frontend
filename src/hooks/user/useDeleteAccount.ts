import { useTranslation } from "react-i18next";
import { useAuth } from "./useAuth.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api.ts";
import { toast } from "sonner";

export const useDeleteMyAccount = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await api.deleteMyAccount();
    },
    onSuccess: () => {
      toast.success(t("AccountDeletedToast"));

      queryClient.clear();

      logout();
    },
  });
};
