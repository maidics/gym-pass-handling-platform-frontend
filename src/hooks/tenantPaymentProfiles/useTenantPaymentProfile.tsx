import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@api/api.ts";
import {
  CreateTenantPaymentProfileCommand,
  GeneratePaymentProviderLinkCommand,
} from "@api/types.ts";

const tenantPaymentProfileKeys = {
  my: ["myTenantPaymentProfile"],
};

export const useGetMyTenantPaymentProfile = () => {
  return useQuery({
    queryKey: tenantPaymentProfileKeys.my,
    queryFn: async () => {
      return await api.getMyTenantPaymentProfile();
    },
  });
};

export const useCreateTenantPaymentProfile = () => {
  return useMutation({
    mutationFn: async (command: CreateTenantPaymentProfileCommand) => {
      return await api.createTenantPaymentProfile(command);
    },
    //redirect logic lives in form
  });
};

export const useGeneratePaymentProviderLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (command: GeneratePaymentProviderLinkCommand) => {
      return await api.generatePaymentProviderLink(command);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantPaymentProfileKeys.my });
    },
  });
};
