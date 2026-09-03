import { useQuery } from "@tanstack/react-query";
import api from "../../api/api.ts";
import { useDebounce } from "../utils/useDebounce.ts";

export const gymKeys = {
  gyms: ["gyms"] as const,
  gym: (id: string) => ["gym", id] as const,
};

export const useSearchGyms = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);

  const isDebouncing = query !== debouncedQuery;

  const { data, isLoading, isFetching, ...rest } = useQuery({
    queryKey: gymKeys.gyms,
    queryFn: async () => {
      return await api.getAllGyms();
    },
  });

  const filteredGyms = (data || []).filter((gym: any) => {
    if (!debouncedQuery) return false;

    const name = gym.name?.toLowerCase() || "";
    return name.includes(debouncedQuery.toLowerCase());
  });

  return {
    isLoading: isLoading || isDebouncing,

    data: filteredGyms,

    isFetching,
    ...rest,
  };
};

export const useGetGymById = (id: string | undefined) => {
  const { data, isLoading, isPending } = useQuery({
    queryKey: gymKeys.gym(id ?? "invalidId"),
    queryFn: async () => {
      if (!id) return null;
      return await api.getGymById(id);
    },
    enabled: !!id,
    retry: false,
  });

  return {
    gym: data,
    isLoading: isLoading || isPending,
  };
};

export const useGetGyms = () => {
  const { data, isLoading } = useQuery({
    queryKey: gymKeys.gyms,
    queryFn: async () => {
      return await api.getAllGyms();
    },
  });

  return {
    gyms: data,
    isLoading: isLoading,
  };
};
