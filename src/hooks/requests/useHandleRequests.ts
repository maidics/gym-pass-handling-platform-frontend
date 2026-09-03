import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@api/api.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { requestKeys } from "./useGetRequests";
import { gymKeys } from "@hooks/gyms/useGetGyms.ts";
import { useNavigate } from "react-router-dom";
import { PromotePendingGymEmployeeToGymAdminFromRequestCommand } from "@api/types.ts";

export const useFulfillOtherRequest = (requestId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await api.fulfillOtherTypeRequest(requestId);
    },
    onSuccess: () => {
      toast.success(t("RequestMarkedAsCompleted"));

      queryClient.invalidateQueries({ queryKey: requestKeys.user(requestId) });
      queryClient.invalidateQueries({ queryKey: requestKeys.appAdmin });
    },
  });
};

export const useRejectRequest = (requestId: string) => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (rationale: string) => {
      return await api.rejectRequest(requestId, rationale);
    },

    onSuccess: () => {
      toast.success(t("RequestRejectedSuccessfully"));

      queryClient.invalidateQueries({ queryKey: requestKeys.appAdmin });
      queryClient.invalidateQueries({ queryKey: requestKeys.user(requestId) });
    },
  });
};

export const useCancelMyRequest = (requestId: string) => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  return useMutation({
    mutationFn: async () => {
      return await api.cancelMyRequest(requestId);
    },

    onSuccess: () => {
      toast.success(t("RequestCanceledSuccessfully"));

      queryClient.invalidateQueries({ queryKey: requestKeys.userAll });
      queryClient.invalidateQueries({ queryKey: requestKeys.user(requestId) });
    },
  });
};

export const useRegisterGymFromRequest = (requestId: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      return await api.registerGymFromRequest(requestId);
    },

    onSuccess: (x) => {
      navigate(`/gyms/${x.id}`);

      toast.success(t("GymCreationFromRequestSuccess"));

      queryClient.invalidateQueries({ queryKey: requestKeys.appAdmin });
      queryClient.invalidateQueries({ queryKey: gymKeys.gyms });
      queryClient.invalidateQueries({ queryKey: requestKeys.user(requestId) });
    },
  });
};

export const useGymAdminPromotionFromRequest = (requestId: string) => {
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  return useMutation({
    mutationFn: async () => {
      const command: PromotePendingGymEmployeeToGymAdminFromRequestCommand = {
        requestId: requestId,
      };

      return await api.promotePendingGymEmployeeToGymAdminFromRequest(command);
    },

    onSuccess: () => {
      toast.success(t("UserPromotedToGymAdmin"));

      queryClient.invalidateQueries({ queryKey: requestKeys.appAdmin });
      queryClient.invalidateQueries({ queryKey: requestKeys.user(requestId) });
    },
  });
};
