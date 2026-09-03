import { useMutation } from "@tanstack/react-query";
import api from "@api/api.ts";

export const useCreateGymPassProductOneTimePaymentIntent = () => {
  return useMutation({
    mutationFn: async ({ gymPassProductId }: { gymPassProductId: string }) => {
      return await api.createGymPassProductOnetimePaymentIntent(
        gymPassProductId,
      );
    },
  });
};
