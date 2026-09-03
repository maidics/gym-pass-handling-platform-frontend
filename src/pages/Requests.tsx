import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ClipboardList } from "lucide-react";
import { PriorityLevel, RequestStatus, RequestType } from "@api/types.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card.tsx";
import { Button } from "@components/ui/button.tsx";
import { Skeleton } from "@components/ui/skeleton.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible.tsx";
import { RequestsTable } from "@components/requests/RequestsTable.tsx";
import { roles } from "@constants/roles.ts";
import { CreateRequestDialog } from "@components/requests/CreateRequestDialog.tsx";
import { useAuth } from "@hooks/user/useAuth.ts";
import { useGetRequests } from "@hooks/requests/useGetRequests.ts";
import { useSessionState } from "@hooks/utils/useSessionState.ts";
import { cn } from "@lib/utils.ts";
import { Separator } from "@components/ui/separator.tsx";
import { LoadingSkeleton } from "@ui/loadingSkeleton.tsx";
import { PageHeader, PageHeaderItem } from "@components/pages/PageHeader.tsx";

export default function Requests() {
  const { t } = useTranslation();
  const { isInRole } = useAuth();

  const { data: requestsData, isLoading } = useGetRequests();
  const requests = requestsData || [];

  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const [priorityFilter, setPriorityFilter] = useSessionState<
    PriorityLevel | "all"
  >("requests-priority-filter", "all");
  const [statusFilter, setStatusFilter] = useSessionState<
    RequestStatus | "all"
  >("requests-status-filter", "all");
  const [typeFilter, setTypeFilter] = useSessionState<RequestType | "all">(
    "requests-type-filter",
    "all",
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (priorityFilter !== "all" && request.priorityLevel !== priorityFilter)
        return false;
      if (statusFilter !== "all" && request.status !== statusFilter)
        return false;
      if (typeFilter !== "all" && request.type !== typeFilter) return false;
      return true;
    });
  }, [requests, priorityFilter, statusFilter, typeFilter]);

  const clearFilters = () => {
    setPriorityFilter("all");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters =
    priorityFilter !== "all" || statusFilter !== "all" || typeFilter !== "all";

  const isTableEmpty = filteredRequests.length === 0;

  const stats = [
    {
      label: t("Total"),
      value: requests.length,
      onClick: clearFilters,
      borderColor: "border-l-primary",
      active: !hasActiveFilters,
    },
    {
      label: t("Submitted"),
      value: requests.filter((r) => r.status === "Submitted").length,
      onClick: () => {
        clearFilters();
        setStatusFilter("Submitted");
      },
      borderColor: "border-l-yellow-500",
      active: statusFilter === "Submitted",
    },
    {
      label: t("Approved"),
      value: requests.filter((r) => r.status === "Approved").length,
      onClick: () => {
        clearFilters();
        setStatusFilter("Approved");
      },
      borderColor: "border-l-green-500",
      active: statusFilter === "Approved",
    },
    {
      label: t("Cancelled"),
      value: requests.filter((r) => r.status === "Cancelled").length,
      onClick: () => {
        clearFilters();
        setStatusFilter("Cancelled");
      },
      borderColor: "border-l-gray-500",
      active: statusFilter === "Cancelled",
    },
    {
      label: t("Rejected"),
      value: requests.filter((r) => r.status === "Rejected").length,
      onClick: () => {
        clearFilters();
        setStatusFilter("Rejected");
      },
      borderColor: "border-l-red-500",
      active: statusFilter === "Rejected",
    },
    {
      label: t("Error"),
      value: requests.filter((r) => r.status === "Error").length,
      onClick: () => {
        clearFilters();
        setStatusFilter("Error");
      },
      borderColor: "border-l-red-700",
      active: statusFilter === "Error",
    },
  ];

  const subtitle = isInRole(roles.AppAdministrator)
    ? t("ViewAndManageRequestsDescription")
    : t("ViewYourRequestsDescription");

  const primaryTools: PageHeaderItem[] = [];

  !isInRole(roles.AppAdministrator) &&
    primaryTools.push({
      id: "createRequest",
      index: 0,
      node: <CreateRequestDialog />,
    });

  return (
    <div className="flex flex-col gap-2 sm:gap-4 min-w-0">
      <PageHeader
        showBackButton
        icon={<ClipboardList className="h-6 w-6 text-primary" />}
        title={t("Requests")}
        subtitle={subtitle}
        primaryToolbar={primaryTools}
      />

      <Collapsible
        open={isStatsOpen}
        onOpenChange={setIsStatsOpen}
        className="shrink-0 space-y-1 sm:space-y-2 min-w-0"
      >
        <div className="flex items-center justify-between px-1 min-w-0">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider">
            {t("Overview")}
          </span>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 sm:h-8 gap-1 sm:gap-2 shrink-0"
            >
              <span className="text-[10px] sm:text-xs font-semibold">
                {isStatsOpen ? t("Hide") : t("Show")}
              </span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200",
                  isStatsOpen && "rotate-180",
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        {!isStatsOpen && (
          <Separator className="animate-in fade-in duration-300" />
        )}

        <CollapsibleContent>
          <div className="pt-2 sm:pt-3 pb-1">
            <div className="grid gap-2 sm:gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6 min-w-0">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                stats.map((stat, index) => (
                  <Card
                    key={index}
                    onClick={() => stat.onClick()}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "both",
                    }}
                    className={cn(
                      "cursor-pointer transition-all hover:bg-accent hover:shadow-sm border-l-4",
                      "animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300",
                      stat.borderColor,
                      stat.active && "ring-1 ring-primary/20 bg-accent",
                    )}
                  >
                    <CardHeader className="p-2 sm:p-3 text-center space-y-0 sm:space-y-0.5">
                      <CardDescription className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider leading-none">
                        {stat.label}
                      </CardDescription>
                      <CardTitle className="text-lg sm:text-xl font-bold">
                        {stat.value}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Card
        className={cn(
          "flex flex-col min-h-0 min-w-0",
          isTableEmpty ? "flex-1" : "h-auto max-h-full",
        )}
      >
        <CardContent className="flex-1 min-h-0 overflow-hidden p-0 min-w-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between gap-3 min-w-0">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-10 w-[100px]" />
              </div>
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : (
            <div className="h-full min-w-0">
              <RequestsTable
                requests={filteredRequests}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
