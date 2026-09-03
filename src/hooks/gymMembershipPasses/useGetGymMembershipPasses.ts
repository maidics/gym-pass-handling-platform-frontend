import { useQuery } from "@tanstack/react-query";
import api from "../../api/api.ts";

export const gymMembershipPassKeys = {
  my: ["myGymMembershipPasses"],
};

export const useGetMyGymMembershipPasses = () => {
  return useQuery({
    queryKey: gymMembershipPassKeys.my,
    queryFn: async () => {
      return await api.getMyGymMembershipPasses();
    },
  });
};
