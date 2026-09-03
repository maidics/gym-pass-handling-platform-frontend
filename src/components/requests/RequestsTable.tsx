import { useNavigate } from "react-router-dom";
import { FileXCorner, FunnelX, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table.tsx";
import { Button } from "@ui/button.tsx";
import { Badge } from "@ui/badge.tsx";
import { formatDateTime } from "@lib/dateTimeUtils.ts";
import {
  PriorityLevel,
  RequestDto,
  RequestStatus,
  RequestType,
} from "@api/types.ts";
import { useTranslation } from "react-i18next";
import { roles } from "@constants/roles.ts";
import { useAuth } from "@hooks/user/useAuth.ts";
import {
  getRequestPriorityVariant,
  getRequestStatusVariant,
} from "@lib/requestUtils.ts";
import { cn } from "@lib/utils.ts";
import { FilterableHeader } from "@ui/filterableHeader.tsx";
import { NoItemFound } from "@ui/noItemFound.tsx";

interface RequestsTableProps {
  requests: RequestDto[];
  priorityFilter: PriorityLevel | "all";
  setPriorityFilter: (val: PriorityLevel | "all") => void;
  statusFilter: RequestStatus | "all";
  setStatusFilter: (val: RequestStatus | "all") => void;
  typeFilter: RequestType | "all";
  setTypeFilter: (val: RequestType | "all") => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function RequestsTable({
  requests,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  clearFilters,
  hasActiveFilters,
}: RequestsTableProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isInRole } = useAuth();

  const priorities: PriorityLevel[] = ["None", "Low", "Medium", "High"];
  const types: RequestType[] = ["GymCreation", "GymAdminPromotion", "Other"];
  const statuses: RequestStatus[] = [
    "Submitted",
    "Approved",
    "Cancelled",
    "Rejected",
    "Error",
  ];

  const TableColumnGroup = () => (
    <colgroup>
      <col className="w-[30%] sm:w-[22%] sm:min-w-[150px]" />
      <col className="w-[20%] sm:w-[140px]" />
      <col className="w-[20%] sm:table-column sm:w-[180px]" />
      <col className="w-[30%] sm:w-[150px]" />
      <col className="hidden lg:table-column w-[100px]" />
      <col className="hidden lg:table-column w-[140px]" />
    </colgroup>
  );

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border border-border overflow-hidden bg-background",
        requests.length === 0 ? "h-full" : "h-auto max-h-full",
      )}
    >
      <div className="flex-none bg-card z-10 border-b shadow-[0_1px_0_0_hsl(var(--border))] [scrollbar-gutter:stable] overflow-hidden">
        <Table className="table-fixed w-full">
          <TableColumnGroup />
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="p-2 sm:p-4 text-xs sm:text-sm truncate">
                {t("Title")}
              </TableHead>

              <TableHead className="p-2 sm:p-4">
                <FilterableHeader
                  title={t("Priority")}
                  currentValue={priorityFilter}
                  onSelect={setPriorityFilter}
                  options={priorities}
                />
              </TableHead>

              <TableHead className="p-2 sm:p-4">
                <FilterableHeader
                  title={t("Type")}
                  currentValue={typeFilter}
                  onSelect={setTypeFilter}
                  options={types}
                />
              </TableHead>

              <TableHead className="p-2 sm:p-4 relative">
                <FilterableHeader
                  title={t("Status")}
                  currentValue={statusFilter}
                  onSelect={setStatusFilter}
                  options={statuses}
                />
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFilters}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 lg:hidden"
                    title={t("ClearFilter")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </TableHead>

              <TableHead className="hidden lg:table-cell">
                {t("Created")}
              </TableHead>

              <TableHead className="hidden lg:table-cell">
                <div className="flex items-center justify-between">
                  <span>{t("Modified")}</span>
                  {hasActiveFilters && (
                    <div className="flex items-center animate-in fade-in duration-200">
                      <div className="h-4 w-[1px] bg-border mx-2" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearFilters}
                        className="ml-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title={t("ClearFilter")}
                      >
                        <FunnelX className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <Table className="table-fixed h-full w-full">
          <TableColumnGroup />
          <TableBody>
            {requests.length === 0 ? (
              <TableRow className="hover:bg-transparent h-full">
                <TableCell colSpan={6} className="h-full vertical-align-middle">
                  <NoItemFound
                    Icon={FileXCorner}
                    titleKey={
                      isInRole(roles.AppAdministrator)
                        ? "NoRequestsFound"
                        : "YouHaveNoRequests"
                    }
                    showClearFilter={hasActiveFilters}
                    onClearFilter={clearFilters}
                  />
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow
                  key={request.id}
                  className="cursor-pointer hover:bg-muted/50 text-xs sm:text-sm"
                  onClick={() => navigate(`/requests/${request.id}`)}
                >
                  <TableCell className="font-medium truncate p-2 sm:p-4 sm:pl-4">
                    {request.title}
                  </TableCell>

                  <TableCell className="p-2 sm:p-4">
                    <Badge
                      variant={getRequestPriorityVariant(request.priorityLevel)}
                      className="capitalize h-5 px-1 text-[10px] sm:h-auto sm:px-2.5 sm:text-xs"
                    >
                      {t(request.priorityLevel)}
                    </Badge>
                  </TableCell>

                  <TableCell className="p-2 sm:p-4">
                    <Badge
                      variant="outline"
                      className="capitalize h-5 px-1 text-[10px] sm:h-auto sm:px-2.5 sm:text-xs truncate max-w-[80px] sm:max-w-none"
                    >
                      {t(request.type)}
                    </Badge>
                  </TableCell>

                  <TableCell className="truncate p-2 sm:p-4">
                    <Badge
                      variant={getRequestStatusVariant(request.status)}
                      className="capitalize h-5 px-1 text-[10px] sm:h-auto sm:px-2.5 sm:text-xs"
                    >
                      {t(request.status)}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm truncate">
                    {formatDateTime(request.createdOn)}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm truncate">
                    {formatDateTime(request.lastModifiedOn)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
