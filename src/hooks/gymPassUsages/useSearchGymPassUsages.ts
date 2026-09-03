import { useMemo } from "react";
import { useDebounce } from "@hooks/utils/useDebounce";
import type { GymPassUsageDto } from "@api/types";
import { buildGymPassUsageSearchText } from "@lib/gymPassUsageUtils";

interface SearchHookResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  isFetching?: boolean;
}

const normalize = (s: string) => s.toLowerCase().trim();
const tokensOf = (q: string) => normalize(q).split(/\s+/).filter(Boolean);

export const createUseSearchGymPassUsages = (
  source: GymPassUsageDto[],
  baseLoading: boolean,
  debounceMs = 300,
): ((query: string) => SearchHookResult<GymPassUsageDto>) => {
  return function useSearchGymPassUsages(query: string) {
    const debouncedQuery = useDebounce(query, debounceMs);
    const isDebouncing = query !== debouncedQuery;

    const filtered = useMemo(() => {
      const q = debouncedQuery.trim();
      if (!q) return [];

      const toks = tokensOf(q);

      return source.filter((u) => {
        const hay = buildGymPassUsageSearchText(u);
        return toks.every((t) => hay.includes(t));
      });
    }, [source, debouncedQuery]);

    return {
      data: filtered,
      isLoading: baseLoading || isDebouncing,
      isFetching: false,
    };
  };
};
