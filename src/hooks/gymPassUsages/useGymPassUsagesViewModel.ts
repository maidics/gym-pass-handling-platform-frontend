import { useEffect, useMemo, useRef, useState } from "react";
import type { GymPassUsageDto } from "@api/types.ts";
import { toDate, formatDateOnly } from "@lib/dateTimeUtils.ts";

type PassUseResultFilter = "all" | "Success" | "Expired";

export type UsageFilters = {
  result: PassUseResultFilter;
  passType: "all" | string;
  date: "all" | string;
};

export const defaultFilters: UsageFilters = {
  result: "all",
  passType: "all",
  date: "all",
};

export type UsageSortField = "createdOn";
export type SortValue<TField extends string> = {
  by: TField;
  order: "asc" | "desc";
};

export const defaultSort: SortValue<UsageSortField> = {
  by: "createdOn",
  order: "desc",
};

export function getUsageKey(u: GymPassUsageDto) {
  const start = toDate(u.createdOn);
  return `${u.gymId}-${start ? start.toISOString() : String(u.createdOn)}`;
}

export function useGymPassUsagesViewModel(params: {
  usagesRaw: GymPassUsageDto[] | undefined;
  isLoading: boolean;
}) {
  const { usagesRaw, isLoading } = params;

  const [filters, setFilters] = useState<UsageFilters>(defaultFilters);
  const [sort, setSort] = useState<SortValue<UsageSortField>>(defaultSort);

  const { dateOptions, passTypeOptions } = useMemo(() => {
    const items = usagesRaw ?? [];
    const dateSet = new Set<string>();
    const passTypeSet = new Set<string>();

    for (const u of items) {
      const start = toDate(u.createdOn);
      if (start) dateSet.add(formatDateOnly(start));
      if (u.passType) passTypeSet.add(String(u.passType));
    }

    return {
      dateOptions: Array.from(dateSet).sort().reverse(),
      passTypeOptions: Array.from(passTypeSet).sort(),
    };
  }, [usagesRaw]);

  const items = useMemo(() => {
    const base = usagesRaw ?? [];

    const filtered = base.filter((u) => {
      if (filters.result !== "all") {
        if (filters.result === "Success" && u.passUseResult !== "Success")
          return false;
        if (filters.result === "Expired" && u.passUseResult !== "Expired")
          return false;
      }

      if (filters.passType !== "all" && String(u.passType) !== filters.passType)
        return false;

      if (filters.date !== "all") {
        const start = toDate(u.createdOn);
        if (!start) return false;
        if (formatDateOnly(start) !== filters.date) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      const aStart = toDate(a.createdOn)?.getTime() ?? 0;
      const bStart = toDate(b.createdOn)?.getTime() ?? 0;
      const cmp = aStart - bStart;
      return sort.order === "asc" ? cmp : -cmp;
    });
  }, [usagesRaw, filters, sort]);

  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  const toggleCard = (key: string) => {
    setOpenCards((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const hasRunningSessions = useMemo(
    () =>
      items.some(
        (u) => u.passUseResult === "Success" && !toDate(u.gymSessionEndedAt),
      ),
    [items],
  );

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!hasRunningSessions) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [hasRunningSessions]);

  const [highlightKey, setHighlightKey] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setCardRef = (key: string) => (el: HTMLDivElement | null) => {
    cardRefs.current[key] = el;
  };

  useEffect(() => {
    if (!highlightKey) return;

    cardRefs.current[highlightKey]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const id = window.setTimeout(() => setHighlightKey(null), 1800);
    return () => window.clearTimeout(id);
  }, [highlightKey]);

  const focusUsage = (u: GymPassUsageDto) => {
    const key = getUsageKey(u);

    setOpenCards((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });

    setHighlightKey(key);
  };

  const subtitleDateLabel =
    filters.date !== "all"
      ? filters.date
      : items[0]?.createdOn
        ? formatDateOnly(toDate(items[0].createdOn)!)
        : formatDateOnly(new Date());

  const rightMeta = !isLoading && `Showing ${items.length} results`;

  return {
    filters,
    setFilters,
    sort,
    setSort,

    items,
    dateOptions,
    passTypeOptions,

    openCards,
    toggleCard,

    now,

    highlightKey,
    setCardRef,
    focusUsage,

    subtitleDateLabel,
    rightMeta,
  };
}
