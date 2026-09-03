import { useQuery } from "@tanstack/react-query";
import api from "@api/api.ts";

export const gymMembershipKeys = {
  myGym: ["myGym"],
};

export const useGetGymMembershipsToMyGym = () => {
  return useQuery({
    queryKey: gymMembershipKeys.myGym,
    queryFn: async () => {
      return await api.getGymMembershipsQueryToMyGym();
    },
  });
};
