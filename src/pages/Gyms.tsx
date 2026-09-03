import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronDown, Dumbbell, MapPin, Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetGyms } from "@hooks/gyms/useGetGyms";
import type { GymDto, GymStatus, GymTier } from "@api/types";
import { PageHeader, type PageHeaderItem } from "@components/pages/PageHeader";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import { LoadingSkeleton } from "@ui/loadingSkeleton";
import { NoItemFound } from "@ui/noItemFound";
import { getGymStatusConfig, getGymTierConfig } from "@lib/gymUtils";
import { formatFullAddress } from "@lib/addressUtils";
import { formatMoney } from "@lib/moneyUtils";
import { FilterPopover } from "@components/ui/filterPopover";
import { SortPopover, type SortValue } from "@components/ui/sortPopover";
import { cn } from "@lib/utils.ts";

type GymFilters = {
  status: GymStatus | "all";
  tier: GymTier | "all";
  country: string; // includes "all"
  city: string; // includes "all"
};

const defaultFilters: GymFilters = {
  status: "Active",
  tier: "all",
  country: "all",
  city: "all",
};

type GymSortField = "name" | "tier";

export default function Gyms() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { gyms, isLoading } = useGetGyms();

  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<GymFilters>(defaultFilters);
  const [sort, setSort] = useState<SortValue<GymSortField>>({
    by: "name",
    order: "asc",
  });

  const toggleCard = (id: string) => {
    setOpenCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { countries, cities } = useMemo(() => {
    if (!gyms) return { countries: [], cities: [] };

    const countrySet = new Set<string>();
    const citySet = new Set<string>();

    gyms.forEach((gym) => {
      countrySet.add(gym.address.countryAlpha2);
      citySet.add(gym.address.city);
    });

    return {
      countries: Array.from(countrySet).sort(),
      cities: Array.from(citySet).sort(),
    };
  }, [gyms]);

  const tierOrder: Record<GymTier, number> = {
    Local: 1,
    MidRange: 2,
    Premium: 3,
    Elite: 4,
  };

  const filteredGyms = useMemo(() => {
    if (!gyms) return [];

    const filtered = gyms.filter((gym) => {
      if (filters.status !== "all" && gym.status !== filters.status)
        return false;

      if (filters.tier !== "all" && gym.tier !== filters.tier) return false;

      if (
        filters.country !== "all" &&
        gym.address.countryAlpha2 !== filters.country
      )
        return false;

      if (filters.city !== "all" && gym.address.city !== filters.city)
        return false;

      return true;
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sort.by === "name") comparison = a.name.localeCompare(b.name);
      else if (sort.by === "tier")
        comparison = tierOrder[a.tier] - tierOrder[b.tier];

      return sort.order === "asc" ? comparison : -comparison;
    });
  }, [
    gyms,
    filters.status,
    filters.tier,
    filters.country,
    filters.city,
    sort.by,
    sort.order,
  ]);

  const clearFilters = () => setFilters(defaultFilters);

  const rightMeta =
    !isLoading &&
    t("TotalGyms", {
      amount: filteredGyms.length,
    });

  const filterFields = useMemo(
    () => [
      {
        type: "select" as const,
        key: "status" as const,
        label: t("Status"),
        options: [
          { value: "all", label: t("All") },
          { value: "Active", label: t("Active") },
          { value: "Inactive", label: t("Inactive") },
          { value: "Suspended", label: t("Suspended") },
        ],
      },
      {
        type: "select" as const,
        key: "tier" as const,
        label: t("Tier"),
        options: [
          { value: "all", label: t("All") },
          { value: "Local", label: t("Local") },
          { value: "MidRange", label: t("MidRange") },
          { value: "Premium", label: t("Premium") },
          { value: "Elite", label: t("Elite") },
        ],
      },
      {
        type: "select" as const,
        key: "country" as const,
        label: t("Country"),
        options: [
          { value: "all", label: t("All") },
          ...countries.map((c) => ({ value: c, label: c })),
        ],
      },
      {
        type: "select" as const,
        key: "city" as const,
        label: t("City"),
        options: [
          { value: "all", label: t("All") },
          ...cities.map((c) => ({ value: c, label: c })),
        ],
      },
    ],
    [t, countries, cities],
  );

  const sortItems = useMemo(
    () => [
      {
        by: "name" as const,
        order: "asc" as const,
        label: t("NameFilter", { value: t("AtoZ") }),
      },
      {
        by: "name" as const,
        order: "desc" as const,
        label: t("NameFilter", { value: t("ZtoA") }),
      },
      {
        by: "tier" as const,
        order: "asc" as const,
        label: t("TierFilter", { value: t("LowToHigh") }),
      },
      {
        by: "tier" as const,
        order: "desc" as const,
        label: t("TierFilter", { value: t("HighToLow") }),
      },
    ],
    [t],
  );

  const secondary: PageHeaderItem[] = [
    {
      id: "sorting",
      index: 0,
      node: (
        <SortPopover<GymSortField>
          value={sort}
          onChange={setSort}
          items={sortItems}
          title={t("Sort")}
          triggerLabel={t("Sort")}
          align="end"
          contentClassName="w-64"
          triggerClassName="w-full sm:w-[160px] justify-start"
        />
      ),
    },
    {
      id: "filter",
      index: 1,
      node: (
        <FilterPopover<GymFilters>
          value={filters}
          defaults={defaultFilters}
          onChange={setFilters}
          fields={filterFields}
          triggerLabel={t("Filters")}
          title={t("Filters")}
          align="end"
          contentClassName="w-80"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        icon={<Dumbbell className="h-6 w-6 text-primary" />}
        title={t("Gyms")}
        subtitle={t("BrowseGymsDescription")}
        metaDisplay={rightMeta}
        secondaryToolbar={secondary}
        showBackButton
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredGyms.length === 0 ? (
        <NoItemFound titleKey="NoGymsFound" onClearFilter={clearFilters} />
      ) : (
        <div className="space-y-3 min-w-0">
          {filteredGyms.map((gym: GymDto) => {
            const statusConfig = getGymStatusConfig(gym.status);
            const tierConfig = getGymTierConfig(gym.tier);
            const isOpen = openCards.has(gym.id);

            const activePasses =
              gym.passProducts?.filter((p: any) => p.isActive).slice(0, 3) ||
              [];

            return (
              <Collapsible
                key={gym.id}
                open={isOpen}
                onOpenChange={() => toggleCard(gym.id)}
              >
                <Card className="transition-all hover:shadow-md hover:border-primary/20">
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-5 cursor-pointer">
                      <div className="flex items-center justify-between gap-4 min-w-0">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-lg break-words">
                              {gym.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5 min-w-0">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {gym.address.city}, {gym.address.countryAlpha2}
                              </span>
                            </div>
                          </div>

                          <div className="hidden sm:flex items-center gap-2 shrink-0">
                            <Badge
                              variant="outline"
                              className={statusConfig.className}
                            >
                              {t(gym.status)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={tierConfig.className}
                            >
                              {t(gym.tier)}
                            </Badge>
                          </div>
                        </div>

                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0",
                            isOpen && "rotate-180",
                          )}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
                        <Badge
                          variant="outline"
                          className={statusConfig.className}
                        >
                          {t(gym.status)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={tierConfig.className}
                        >
                          {t(gym.tier)}
                        </Badge>
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-5 pb-5 pt-0 border-t">
                      <div className="pt-4 grid gap-6 md:grid-cols-2 min-w-0">
                        <div className="space-y-3 min-w-0">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              {t("FullAddress")}
                            </p>
                            <p className="text-sm break-words">
                              {formatFullAddress(gym.address)}
                            </p>
                          </div>

                          <div className="flex gap-6 flex-wrap">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                {t("Status")}
                              </p>
                              <Badge
                                variant="outline"
                                className={statusConfig.className}
                              >
                                {t(gym.status)}
                              </Badge>
                            </div>

                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                {t("Tier")}
                              </p>
                              <Badge
                                variant="outline"
                                className={tierConfig.className}
                              >
                                {t(gym.tier)}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            {t("AvailablePasses") + " "}
                            {activePasses.length > 0 &&
                              `(${activePasses.length})`}
                          </p>

                          {activePasses.length > 0 ? (
                            <div className="space-y-2">
                              {activePasses.map((pass: any) => (
                                <div
                                  key={pass.id}
                                  className="flex items-center justify-between gap-3 text-sm bg-muted/50 rounded-md px-3 py-2 min-w-0"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Ticket className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="font-medium truncate">
                                      {pass.name}
                                    </span>
                                  </div>
                                  <span className="text-muted-foreground shrink-0">
                                    {t(formatMoney(pass.price))}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {t("NoPassesAvailable")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/gyms/${gym.id}`)}
                        >
                          {t("ViewDetails")}
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}
