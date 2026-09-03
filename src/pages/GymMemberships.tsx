import { useMemo, useState } from "react";
import {
  Ban,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageHeader, type PageHeaderItem } from "@components/pages/PageHeader";
import { LoadingSkeleton } from "@ui/loadingSkeleton";
import { Button } from "@ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Badge } from "@components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { FilterPopover } from "@components/ui/filterPopover";
import { SortPopover, type SortValue } from "@components/ui/sortPopover";

import { useGetGymMembershipsToMyGym } from "@hooks/gymMemberships/useGetGymMemberships";
import { useUpdateGymMembershipStatus } from "@hooks/gymMemberships/useUpdateGymMemberships";
import { BanMemberDialog } from "@components/gymMemberships/BanMemberDialog";
import { getGymMembershipStatusConfig } from "@lib/gymMembershipUtils";
import { cn } from "@lib/utils";
import { NoItemFound } from "@ui/noItemFound";

import type { GymMembershipWithUserProfileAndEmailDto } from "@api/types";

type MembershipStatusFilter = "all" | "Active" | "Banned";

type MembershipFilters = {
  status: MembershipStatusFilter;
};

const defaultFilters: MembershipFilters = {
  status: "all",
};

type MembershipSortField = "name" | "status";

export default function GymMemberships() {
  const { t } = useTranslation();
  const { data: memberships = [], isLoading } = useGetGymMembershipsToMyGym();

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useUpdateGymMembershipStatus();

  const [showStats, setShowStats] = useState(true);

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<GymMembershipWithUserProfileAndEmailDto | null>(null);

  const [filters, setFilters] = useState<MembershipFilters>(defaultFilters);
  const [sort, setSort] = useState<SortValue<MembershipSortField>>({
    by: "name",
    order: "asc",
  });

  const handleSuspendClick = (
    member: GymMembershipWithUserProfileAndEmailDto,
  ) => {
    setSelectedMember(member);
    setSuspendDialogOpen(true);
  };

  const handleSuspendConfirm = async () => {
    if (!selectedMember) return;

    try {
      await updateStatus({
        gymMembershipId: selectedMember.id,
        newStatus: "Banned",
      });

      setSuspendDialogOpen(false);
      setSelectedMember(null);
    } catch {}
  };

  const handleReactivate = async (
    member: GymMembershipWithUserProfileAndEmailDto,
  ) => {
    try {
      await updateStatus({
        gymMembershipId: member.id,
        newStatus: "Active",
      });
    } catch {}
  };

  const filteredMemberships = useMemo(() => {
    const base = memberships ?? [];

    const filtered = base.filter((m) => {
      if (filters.status !== "all" && m.status !== filters.status) return false;
      return true;
    });

    const statusPriority: Record<string, number> = {
      Active: 1,
      Banned: 2,
    };

    return [...filtered].sort((a, b) => {
      let cmp = 0;

      if (sort.by === "name") {
        const nameA =
          `${a.userProfile.firstName ?? ""} ${a.userProfile.lastName ?? ""}`.trim();
        const nameB =
          `${b.userProfile.firstName ?? ""} ${b.userProfile.lastName ?? ""}`.trim();
        cmp = nameA.localeCompare(nameB);
      } else if (sort.by === "status") {
        cmp =
          (statusPriority[a.status] ?? 999) - (statusPriority[b.status] ?? 999);
      }

      return sort.order === "asc" ? cmp : -cmp;
    });
  }, [memberships, filters.status, sort.by, sort.order]);

  const activeMemberships = memberships.filter((m) => m.status === "Active");
  const bannedMemberships = memberships.filter((m) => m.status === "Banned");

  const stats = [
    {
      label: t("TotalMembers"),
      value: memberships.length,
      color: "border-l-primary",
      filter: "all" as const,
    },
    {
      label: t("Banned"),
      value: bannedMemberships.length,
      color: "border-l-red-500",
      filter: "Banned" as const,
    },
    {
      label: t("Active"),
      value: activeMemberships.length,
      color: "border-l-green-500",
      filter: "Active" as const,
    },
  ];

  const applyStatusFilter = (status: MembershipStatusFilter) => {
    setFilters({ status });
  };

  const rightMeta =
    !isLoading &&
    t("ShowingResults", {
      count: filteredMemberships.length,
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
          { value: "Banned", label: t("Banned") },
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
        <FilterPopover<MembershipFilters>
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
    {
      id: "sort",
      index: 1,
      node: (
        <SortPopover<MembershipSortField>
          value={sort}
          onChange={setSort}
          items={[
            { by: "name", order: "asc", label: `${t("Name")} (A–Z)` },
            { by: "name", order: "desc", label: `${t("Name")} (Z–A)` },
            {
              by: "status",
              order: "asc",
              label: `${t("Status")} (${t("Active")} ↑)`,
            },
            {
              by: "status",
              order: "desc",
              label: `${t("Status")} (${t("Banned")} ↑)`,
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
        title={t("GymMemberships")}
        subtitle={t("GymMembershipsDescription")}
        metaDisplay={rightMeta}
        secondaryToolbar={secondary}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <Collapsible open={showStats} onOpenChange={setShowStats}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t("Overview")}
              </span>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  {showStats ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      {t("Hide")}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      {t("Show")}
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
                {stats.map((stat, index) => {
                  const isActive = filters.status === stat.filter;

                  return (
                    <Card
                      key={index}
                      role="button"
                      tabIndex={0}
                      onClick={() => applyStatusFilter(stat.filter)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          applyStatusFilter(stat.filter);
                      }}
                      className={cn(
                        `border-l-4 ${stat.color}`,
                        "cursor-pointer transition-all hover:shadow-md",
                        isActive && "bg-secondary/90",
                      )}
                    >
                      <CardHeader className="p-3 pb-1">
                        <CardDescription className="text-xs">
                          {stat.label}
                        </CardDescription>
                        <CardTitle className="text-xl">{stat.value}</CardTitle>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>{t("Members")}</CardTitle>
              <CardDescription>
                {t("ShowingResults", { count: filteredMemberships.length })}
              </CardDescription>
            </CardHeader>

            <CardContent className="min-w-0">
              {memberships.length === 0 ? (
                <NoItemFound Icon={UserX} titleKey="NoMembersYet" />
              ) : filteredMemberships.length === 0 ? (
                <NoItemFound
                  Icon={UserX}
                  titleKey=" "
                  showClearFilter
                  onClearFilter={() => setFilters(defaultFilters)}
                />
              ) : (
                <div className="rounded-md border w-full max-w-full overflow-x-auto">
                  <Table className="min-w-[900px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Name")}</TableHead>
                        <TableHead>{t("EmailAddress")}</TableHead>
                        <TableHead>{t("Language")}</TableHead>
                        <TableHead className="text-center">
                          {t("Status")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("Actions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredMemberships.map((membership) => {
                        const statusConfig = getGymMembershipStatusConfig(
                          membership.status,
                        );
                        const fullName =
                          `${membership.userProfile.firstName ?? ""} ${membership.userProfile.lastName ?? ""}`.trim();

                        const canBeSuspended = membership.status === "Active";
                        const canBeReactivated = membership.status === "Banned";

                        return (
                          <TableRow key={membership.id}>
                            <TableCell>
                              <div className="font-medium">{fullName}</div>
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                              {membership.userProfile.email}
                            </TableCell>

                            <TableCell>
                              <Badge variant="outline">
                                {membership.userProfile.preferredLanguage}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-center">
                              <Badge
                                variant={statusConfig.variant}
                                className={statusConfig.className}
                              >
                                {t(statusConfig.label)}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                {canBeSuspended && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() =>
                                          handleSuspendClick(membership)
                                        }
                                        disabled={isUpdatingStatus}
                                      >
                                        <Ban className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {t("BanMember")}
                                    </TooltipContent>
                                  </Tooltip>
                                )}

                                {canBeReactivated && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                        onClick={() =>
                                          handleReactivate(membership)
                                        }
                                        disabled={isUpdatingStatus}
                                      >
                                        <UserCheck className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {t("ActivateMembership")}
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <BanMemberDialog
            open={suspendDialogOpen}
            onOpenChange={setSuspendDialogOpen}
            member={selectedMember}
            onConfirm={handleSuspendConfirm}
            isPending={isUpdatingStatus}
          />
        </>
      )}
    </div>
  );
}
