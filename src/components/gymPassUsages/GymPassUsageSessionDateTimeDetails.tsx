import { PassUseResult } from "@api/types.ts";
import { CalendarDays, ClockFading } from "lucide-react";
import { formatDateOnly, formatTimeOnly } from "@lib/dateTimeUtils.ts";

interface GymPassUsageSessionDateTimeDetailsProps {
  start: Date;
  end?: Date | null;
  passUseResult: PassUseResult;
  elapsed: string;
}

export function GymPassUsageSessionDateTimeDetails({
  start,
  end,
  passUseResult,
  elapsed,
}: GymPassUsageSessionDateTimeDetailsProps) {
  return (
    <>
      <div className="text-sm flex gap-3 mt-1">
        <div className="text-sm flex gap-1">
          <CalendarDays className="h-4 w-4" />
          {formatDateOnly(start)}{" "}
          <span className="font-medium">{formatTimeOnly(start)}</span>
          {end && (
            <span className="font-medium">{` - ${formatTimeOnly(end)}`}</span>
          )}
        </div>
        <div className="text-sm flex gap-1"></div>
      </div>
      {passUseResult === "Success" && (
        <div className="text-sm flex gap-1 mt-1">
          <ClockFading className="h-4 w-4" />
          {elapsed}
        </div>
      )}
    </>
  );
}
