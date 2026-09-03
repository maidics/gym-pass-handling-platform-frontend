import { useQuery } from "@tanstack/react-query";
import api from "../../api/api.ts";

export const gymEmploymentKeys = {
  myGymEmployments: ["myGymEmployments"],
  gymEmployment: (id: string | undefined) => ["gymEmployment", id],
};

export const useGetGymEmploymentsByGymId = () => {
  return useQuery({
    queryKey: gymEmploymentKeys.myGymEmployments,
    queryFn: async () => {
      return await api.getMyGymEmployments();
    },
  });
};

export const useGetGymEmploymentById = (id: string | undefined) => {
  return useQuery({
    queryKey: gymEmploymentKeys.gymEmployment(id),
    queryFn: async () => {
      if (!id) return undefined;
      return await api.getGymEmploymentById(id);
    },
  });
};
