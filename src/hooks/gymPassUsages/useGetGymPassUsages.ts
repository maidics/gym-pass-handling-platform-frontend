import { useQuery } from "@tanstack/react-query";
import api from "@api/api.ts";
import { useAuth } from "@hooks/user/useAuth.ts";
import { roles } from "@constants/roles.ts";

export const gymPassUsageKeys = {
  my: ["myGymPassUsages"],
  myGymToday: ["myGymGymPassUsagesToday"],
};

export const useGetGymPassUsages = () => {
  const { isInRole } = useAuth();

  const isGymEmployee =
    isInRole(roles.GymAdministrator) || isInRole(roles.GymStaff);

  return useQuery({
    queryKey: isGymEmployee
      ? gymPassUsageKeys.myGymToday
      : gymPassUsageKeys.myGymToday,
    queryFn: async () => {
      return isGymEmployee
        ? await api.getGymPassUsagesForMyGymToday()
        : await api.getMyGymPassUsages();
    },
  });
};
