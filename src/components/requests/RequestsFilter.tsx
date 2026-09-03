import { X } from "lucide-react";
import { PriorityLevel, RequestStatus, RequestType } from "@api/types.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select.tsx";
import { Button } from "@ui/button.tsx";
import { useTranslation } from "react-i18next";

const priorityOptions: PriorityLevel[] = ["None", "Low", "Medium", "High"];
const statusOptions: RequestStatus[] = [
  "Submitted",
  "Approved",
  "Cancelled",
  "Rejected",
  "Error",
];
const typeOptions: RequestType[] = [
  "GymCreation",
  "GymAdminPromotion",
  "Other",
];

interface RequestsFilterProps {
  priorityFilter: PriorityLevel | "all";
  statusFilter: RequestStatus | "all";
  typeFilter: RequestType | "all";
  onPriorityChange: (value: PriorityLevel | "all") => void;
  onStatusChange: (value: RequestStatus | "all") => void;
  onTypeChange: (value: RequestType | "all") => void;
  onClearFilters: () => void;
}

export function RequestsFilter({
  priorityFilter,
  statusFilter,
  typeFilter,
  onPriorityChange,
  onStatusChange,
  onTypeChange,
  onClearFilters,
}: RequestsFilterProps) {
  const hasFilters =
    priorityFilter !== "all" || statusFilter !== "all" || typeFilter !== "all";

  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={priorityFilter} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-[180px] text-left">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("PriorityType", { field: t("All") })}
          </SelectItem>
          {priorityOptions.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {t("PriorityType", { field: t(priority) })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px] text-left">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("StatusType", { field: t("All") })}
          </SelectItem>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {t("StatusType", { field: t(status) })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[280px] text-left">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("RequestTypes", { field: t("All") })}
          </SelectItem>
          {typeOptions.map((type) => (
            <SelectItem key={type} value={type}>
              {t("RequestTypes", { field: t(type) })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-1" />
          {t("ClearFilter")}
        </Button>
      )}
    </div>
  );
}
