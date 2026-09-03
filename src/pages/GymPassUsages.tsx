import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSkeleton } from "@ui/loadingSkeleton";
import { NoItemFound } from "@ui/noItemFound";
import { useAuth } from "@hooks/user/useAuth";
import { roles } from "@constants/roles";
import { useGetGymPassUsages } from "@hooks/gymPassUsages/useGetGymPassUsages";
import { createUseSearchGymPassUsages } from "@hooks/gymPassUsages/useSearchGymPassUsages";
import {
  getUsageKey,
  useGymPassUsagesViewModel,
} from "@hooks/gymPassUsages/useGymPassUsagesViewModel";
import { GymPassUsagesHeader } from "@components/gymPassUsages/GymPassUsagesHeader";
import { GymPassUsageCard } from "@components/gymPassUsages/GymPassUsageCard";

export default function GymPassUsages() {
  const { t } = useTranslation();
  const { isInRole, user } = useAuth();

  const isGymEmployee =
    isInRole(roles.GymStaff) || isInRole(roles.GymAdministrator);

  const { data: usagesRaw, isLoading } = useGetGymPassUsages();

  const vm = useGymPassUsagesViewModel({ usagesRaw, isLoading });

  // search only within filtered items
  const useSearchFilteredPassUsages = useMemo(
    () => createUseSearchGymPassUsages(vm.items, isLoading),
    [vm.items, isLoading],
  );

  const canSearch = !isInRole(roles.User);

  const meta =
    !isLoading &&
    t("ShowingResults", {
      count: vm.items.length,
    });

  return (
    <div className="space-y-3 min-w-0">
      <GymPassUsagesHeader
        isGymEmployee={isGymEmployee}
        canSearch={canSearch}
        gymIdForEmployeeButton={user?.gymId}
        title={t(isGymEmployee ? "Entries" : "MyPassUses")}
        description={t(
          isGymEmployee
            ? "GymPassUsagesGymEmployeeDescription"
            : "GymPassUsagesUserDescription",
        )}
        subtitleDateLabel={vm.subtitleDateLabel}
        metaDisplay={meta}
        filters={vm.filters}
        setFilters={vm.setFilters}
        dateOptions={vm.dateOptions}
        passTypeOptions={vm.passTypeOptions}
        sort={vm.sort}
        setSort={vm.setSort}
        useSearch={useSearchFilteredPassUsages}
        onSearchSelect={(u) => vm.focusUsage(u)}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : vm.items.length === 0 ? (
        <NoItemFound />
      ) : (
        <div className="space-y-3 min-w-0">
          {vm.items.map((u) => {
            const key = getUsageKey(u);
            return (
              <GymPassUsageCard
                key={u.id}
                usage={u}
                isOpen={vm.openCards.has(key)}
                onToggle={() => vm.toggleCard(key)}
                now={vm.now}
                isHighlighted={vm.highlightKey === key}
                containerRef={vm.setCardRef(key)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
