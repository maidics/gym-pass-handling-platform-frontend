import { CalendarDays, Building2, NotepadText } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  type PageHeaderItem,
} from "@components/pages/PageHeader.tsx";
import { Button } from "@components/ui/button.tsx";
import { FilterPopover } from "@components/ui/filterPopover.tsx";
import { SortPopover } from "@components/ui/sortPopover.tsx";
import { SearchInput } from "@ui/searchInput.tsx";
import type { GymPassUsageDto } from "@api/types.ts";
import {
  SortValue,
  UsageFilters,
  UsageSortField,
} from "@hooks/gymPassUsages/useGymPassUsagesViewModel";

export function GymPassUsagesHeader(props: {
  isGymEmployee: boolean;
  canSearch: boolean;
  gymIdForEmployeeButton?: string;

  title: string;
  description: string;
  subtitleDateLabel: string;

  metaDisplay?: React.ReactNode;

  filters: UsageFilters;
  setFilters: (f: UsageFilters) => void;
  dateOptions: string[];
  passTypeOptions: string[];

  sort: SortValue<UsageSortField>;
  setSort: (s: SortValue<UsageSortField>) => void;

  useSearch: (query: string) => {
    data: GymPassUsageDto[] | undefined;
    isLoading: boolean;
    isFetching?: boolean;
  };
  onSearchSelect: (u: GymPassUsageDto) => void;
}) {
  const {
    isGymEmployee,
    canSearch,
    gymIdForEmployeeButton,
    title,
    description,
    subtitleDateLabel,
    metaDisplay,
    filters,
    setFilters,
    dateOptions,
    passTypeOptions,
    sort,
    setSort,
    useSearch,
    onSearchSelect,
  } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigation: PageHeaderItem[] = [];
  if (isGymEmployee && gymIdForEmployeeButton) {
    navigation.push({
      id: "myGym",
      index: 0,
      node: (
        <Button
          variant="outline"
          onClick={() => navigate(`/gyms/${gymIdForEmployeeButton}`)}
        >
          <Building2 className="h-4 w-4 mr-1" />
          {t("MyGym")}
        </Button>
      ),
    });
  }

  const filterFields = useMemo(
    () => [
      {
        type: "select" as const,
        key: "result" as const,
        label: t("Result"),
        options: [
          { value: "all", label: t("All") },
          { value: "Success", label: t("Success") },
          { value: "Expired", label: t("ExpiredPass") },
        ],
      },
      {
        type: "select" as const,
        key: "passType" as const,
        label: t("Pass"),
        options: [
          { value: "all", label: t("All") },
          ...passTypeOptions.map((pt) => ({
            value: pt,
            label: t(`${pt}PassLabel`),
          })),
        ],
      },
      {
        type: "select" as const,
        key: "date" as const,
        label: t("Date"),
        options: [
          { value: "all", label: t("All") },
          ...dateOptions.map((d) => ({ value: d, label: d })),
        ],
      },
    ],
    [t, passTypeOptions, dateOptions],
  );

  const secondary: PageHeaderItem[] = [
    {
      id: "filters",
      index: 11,
      node: (
        <FilterPopover<UsageFilters>
          value={filters}
          defaults={{ result: "all", passType: "all", date: "all" }}
          onChange={setFilters}
          fields={filterFields}
          triggerLabel={t("Filters")}
          title={t("Filters")}
          align="end"
          contentClassName="w-80"
        />
      ),
    },
    {
      id: "sort",
      index: 10,
      node: (
        <SortPopover<UsageSortField>
          value={sort}
          onChange={setSort}
          items={[
            { by: "createdOn", order: "desc", label: t("NewestFirst") },
            { by: "createdOn", order: "asc", label: t("OldestFirst") },
          ]}
          title={t("Sort")}
          triggerLabel={t("Sort")}
          align="end"
          contentClassName="w-64"
          triggerClassName="justify-start"
        />
      ),
    },
  ];

  if (canSearch) {
    secondary.push({
      id: "search",
      index: 2,
      node: (
        <SearchInput
          useSearch={useSearch}
          placeholder={t("Search")}
          className="w-[280px]"
          renderItem={(u: GymPassUsageDto) => (
            <div className="flex flex-col">
              <div className="font-medium">
                {[u.firstName, u.lastName].filter(Boolean).join(" ") ||
                  t("PassUsage")}
              </div>
              <div className="text-xs text-muted-foreground">
                <p>
                  {t(`${u.passType}PassLabel`)} ·{" "}
                  {u.passUseResult === "Success" ? t("Success") : t("Expired")}
                </p>
                {t("LockerWithNumber", { number: u.lockerNumber ?? "—" })}
              </div>
            </div>
          )}
          onSelect={onSearchSelect}
        />
      ),
    });
  }

  return (
    <PageHeader
      icon={<NotepadText className="h-6 w-6 text-primary" />}
      title={title}
      subtitle={
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span>{description}</span>
          <span className="inline-flex items-center gap-1">
            (<CalendarDays className="h-4 w-4 inline-block" />
            {subtitleDateLabel})
          </span>
        </div>
      }
      metaDisplay={metaDisplay}
      showBackButton
      navigationToolbar={navigation}
      secondaryToolbar={secondary}
    />
  );
}
