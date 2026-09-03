import { useQuery } from "@tanstack/react-query";
import api from "../../api/api.ts";
import { roles } from "@constants/roles.ts";
import { useAuth } from "../user/useAuth.ts";

export const requestKeys = {
  appAdmin: ["requests", "appAdmin"] as const,
  userAll: ["requests", "user"] as const,
  user: (id: string | undefined) =>
    ["requests", "user", id ?? "invalidKey"] as const,
};

export const useGetRequests = () => {
  const { isInRole } = useAuth();

  const isAppAdmin = isInRole(roles.AppAdministrator);

  return useQuery({
    queryKey: isAppAdmin ? requestKeys.appAdmin : requestKeys.userAll,

    queryFn: async () => {
      if (isAppAdmin) {
        return await api.getRequests();
      } else {
        return await api.getMyRequests();
      }
    },
  });
};

export const useGetRequestById = (requestId: string | undefined) => {
  const { isInRole } = useAuth();

  const isAppAdmin = isInRole(roles.AppAdministrator);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: requestKeys.user(requestId),

    queryFn: async () => {
      if (!requestId) {
        return undefined;
      }

      if (isAppAdmin) {
        return await api.getRequestById(requestId);
      } else {
        return await api.getMyRequestById(requestId);
      }
    },
  });

  return {
    request: data,
    isLoading: isLoading || isFetching,
  };
};
