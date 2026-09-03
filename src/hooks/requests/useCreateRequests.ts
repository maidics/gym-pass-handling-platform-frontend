import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  CreateGymAdminPromotionRequestCommand,
  CreateGymCreationRequestCommand,
  CreatePayloadFreeRequestCommand,
} from "@api/types.ts";
import api from "../../api/api";
import { toast } from "sonner";
import { requestKeys } from "./useGetRequests";

export const useCreateGymCreationRequest = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (command: CreateGymCreationRequestCommand) => {
      return await api.createGymCreationRequest(command);
    },
    onSuccess: () => {
      toast.success(t("RequestCreatedToast"));

      queryClient.invalidateQueries({ queryKey: requestKeys.userAll });
    },
  });
};

export const useCreateGymAdminPromotionRequest = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (command: CreateGymAdminPromotionRequestCommand) => {
      return await api.createGymAdminPromotionRequest(command);
    },
    onSuccess: () => {
      toast.success(t("RequestCreatedToast"));
      queryClient.invalidateQueries({ queryKey: requestKeys.userAll });
    },
  });
};

export const useCreatePayloadFreeRequest = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (command: CreatePayloadFreeRequestCommand) => {
      return await api.createPayloadFreeRequest(command);
    },
    onSuccess: () => {
      toast.success(t("RequestCreatedToast"));
      queryClient.invalidateQueries({ queryKey: requestKeys.userAll });
    },
  });
};
