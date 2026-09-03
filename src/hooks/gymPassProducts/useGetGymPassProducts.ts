import { useQuery } from "@tanstack/react-query";
import api from "@api/api.ts";

export const gymPassProductKeys = {
  gym: (gymId: string) => ["gymPassProducts", gymId],
  one: (gymPassProductId: string) => ["gymPassProduct", gymPassProductId],
};

export const useGetGymPassProducts = (gymId: string) => {
  return useQuery({
    queryKey: gymPassProductKeys.gym(gymId),
    queryFn: async () => {
      return await api.getGymPassProductsByGymId(gymId);
    },
  });
};

export const useGetGymPassProductById = (gymPassProductId: string) => {
  return useQuery({
    queryKey: gymPassProductKeys.one(gymPassProductId),
    queryFn: async () => {
      return await api.getGymPassProductById(gymPassProductId);
    },
  });
};
