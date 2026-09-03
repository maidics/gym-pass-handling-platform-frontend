import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Role, roles } from "@constants/roles";
import { useAuth } from "@hooks/user/useAuth";
import { useGetGymEmploymentsByGymId } from "@hooks/gymEmployments/useGetGymEmployments";
import { getGymEmployeeRoleConfig } from "@lib/userUtils";

import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent } from "@components/ui/card";

import { LoadingSkeleton } from "@ui/loadingSkeleton";
import { NoItemFound } from "@ui/noItemFound";

import { PageHeader, type PageHeaderItem } from "@components/pages/PageHeader";
import { PromotePendingGymEmployeeToGymStaffDialog } from "@components/gymEmployments/PromotePendingGymEmployeeToGymStaffDialog";
import { FilterPopover } from "@components/ui/filterPopover";
import { SortPopover, type SortValue } from "@components/ui/sortPopover";

type EmploymentFilters = {
  role: Role | "all";
};

const defaultFilters: EmploymentFilters = {
  role: "all",
};

type EmploymentSortField = "name" | "role";

export default function GymEmployments() {
  const navigate = useNavigate();
  const { id: gymId } = useParams<{ id: string }>();

  const { t } = useTranslation();
  const { isInRole } = useAuth();

  const { data: employees, isLoading } = useGetGymEmploymentsByGymId();

  const [filters, setFilters] = useState<EmploymentFilters>(defaultFilters);
  const [sort, setSort] = useState<SortValue<EmploymentSortField>>({
    by: "name",
    order: "asc",
  });

  const filteredEmployees = useMemo(() => {
    const base = employees ?? [];

    const filtered = base.filter((emp) => {
      if (filters.role !== "all" && emp.role !== filters.role) return false;
      return true;
    });

    const getRolePriority = (roleName: string | undefined) => {
      if (roleName === roles.GymAdministrator) return 1;
      if (roleName === roles.GymStaff) return 2;
      return 3;
    };

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sort.by === "name") {
        const nameA = a.userProfile
          ? `${a.userProfile.firstName} ${a.userProfile.lastName}`
          : "";
        const nameB = b.userProfile
          ? `${b.userProfile.firstName} ${b.userProfile.lastName}`
          : "";

        comparison = nameA.localeCompare(nameB);
      } else if (sort.by === "role") {
        comparison = getRolePriority(a.role) - getRolePriority(b.role);
      }

      return sort.order === "asc" ? comparison : -comparison;
    });
  }, [employees, filters.role, sort.by, sort.order]);

  const headerActions: PageHeaderItem[] = [];
  if (isInRole(roles.GymAdministrator)) {
    headerActions.push({
      id: "promoteToGymStaff",
      index: 1,
      node: <PromotePendingGymEmployeeToGymStaffDialog />,
    });
  }

  const navigation: PageHeaderItem[] = [
    {
      id: "gym-button",
      index: 0,
      node: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/gyms/${gymId}`)}
          className="gap-2"
        >
          <Building2 className="h-4 w-4" />
          {t("Gym")}
        </Button>
      ),
    },
  ];

  const rightMeta =
    !isLoading &&
    t("ShowingResults", {
      count: filteredEmployees.length,
    });

  const filterFields = useMemo(
    () => [
      {
        type: "select" as const,
        key: "role" as const,
        label: t("Role"),
        options: [
          { value: "all", label: t("All") },
          { value: roles.GymAdministrator, label: t("Administrator") },
          { value: roles.GymStaff, label: t("Staff") },
        ],
      },
    ],
    [t],
  );

  const secondary: PageHeaderItem[] = [
    {
      id: "filters",
      index: 0,
      node: (
        <FilterPopover<EmploymentFilters>
          value={filters as any}
          defaults={defaultFilters as any}
          onChange={(next) => setFilters(next as EmploymentFilters)}
          fields={filterFields as any}
          triggerLabel={t("Filters")}
          title={t("Filters")}
          align="end"
          contentClassName="w-80"
        />
      ),
    },
    {
      id: "sort",
      index: 1,
      node: (
        <SortPopover<EmploymentSortField>
          value={sort}
          onChange={setSort}
          items={[
            { by: "name", order: "asc", label: `${t("Name")} (A–Z)` },
            { by: "name", order: "desc", label: `${t("Name")} (Z–A)` },
            {
              by: "role",
              order: "asc",
              label: `${t("Role")} (${t("Administrator")} ↑)`,
            },
            {
              by: "role",
              order: "desc",
              label: `${t("Role")} (${t("Staff")} ↑)`,
            },
          ]}
          title={t("Sort")}
          triggerLabel={t("Sort")}
          align="end"
          contentClassName="w-64"
          triggerClassName="w-full sm:w-[180px] justify-start"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        showBackButton
        icon={<Users className="h-6 w-6 text-primary" />}
        title={t("Employees")}
        subtitle={
          isInRole(roles.AppAdministrator)
            ? t("EmployeeDescription")
            : t("EmployeeDescriptionForGymEmployee")
        }
        primaryToolbar={headerActions}
        metaDisplay={rightMeta}
        secondaryToolbar={secondary}
        navigationToolbar={navigation}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredEmployees.length === 0 ? (
        <NoItemFound
          titleKey="NoGymEmployeesFoundByFilter"
          onClearFilter={() => setFilters(defaultFilters)}
        />
      ) : (
        <div className="space-y-3 min-w-0">
          {filteredEmployees.map((employee) => {
            const roleConfig = getGymEmployeeRoleConfig(employee.role as any);

            return (
              <Card
                key={employee.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                onClick={() =>
                  navigate(`/gyms/${gymId}/employees/${employee.id}`)
                }
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4 min-w-0">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-semibold">
                          {employee.userProfile?.firstName?.[0] ?? "?"}
                          {employee.userProfile?.lastName?.[0] ?? ""}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground break-words">
                          {employee.userProfile?.firstName}{" "}
                          {employee.userProfile?.lastName}
                        </h3>

                        <div className="text-sm text-muted-foreground break-words">
                          {employee.userProfile?.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={roleConfig.className}>
                        {t(roleConfig.label)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
