import {
  ChevronDown,
  Clock,
  Lock,
  TicketCheck,
  TicketX,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { GymPassUsageDto } from "@api/types.ts";
import { Card, CardContent } from "@components/ui/card.tsx";
import { Badge } from "@components/ui/badge.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible.tsx";
import {
  formatDateTime,
  formatTimeOnly,
  toDate,
  formatDuration,
} from "@lib/dateTimeUtils.ts";
import { getPassUsageResultBadgeVariant } from "@lib/gymPassUsageUtils.ts";
import { GymPassUsageSessionDateTimeDetails } from "@components/gymPassUsages/GymPassUsageSessionDateTimeDetails.tsx";
import { cn } from "@lib/utils.ts";
import { Separator } from "@ui/separator.tsx";
import { EndGymSessionDialog } from "@components/gymPassUsages/EndGymSessionDialog.tsx";
import { UpdateGymPassUsageLockerNumberDialog } from "@components/gymPassUsages/UpdateGymPassUsageLockerNumberDialog.tsx";
import { showManageGymPassUsageButtons } from "@lib/permissions.ts";
import { useAuth } from "@hooks/user/useAuth.ts";
import { roles } from "@constants/roles.ts";

export function GymPassUsageCard(props: {
  usage: GymPassUsageDto;
  isOpen: boolean;
  onToggle: () => void;
  now: Date;
  isHighlighted: boolean;
  containerRef?: (el: HTMLDivElement | null) => void;
}) {
  const { t } = useTranslation();
  const { isInRole } = useAuth();

  const isGymEmployee =
    isInRole(roles.GymAdministrator) || isInRole(roles.GymStaff);

  const {
    usage: u,
    isOpen,
    onToggle,
    now,
    isHighlighted,
    containerRef,
  } = props;

  const successFullUse = u.passUseResult === "Success";
  const start = toDate(u.createdOn);
  const end = toDate(u.gymSessionEndedAt);

  if (!start) return null;

  const elapsedMs = (end ?? now).getTime() - start.getTime();
  const elapsedLabel = successFullUse ? formatDuration(elapsedMs) : "—";

  const displayName =
    isGymEmployee && (u.firstName || u.lastName)
      ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
      : null;

  const passUseResultLabel = successFullUse ? t("Success") : t("ExpiredPass");

  return (
    <div ref={containerRef}>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <Card
          className={cn(
            "transition-all hover:shadow-md hover:border-primary/20",
            isHighlighted && "ring-2 ring-primary ring-inset border-primary/40",
          )}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <CollapsibleTrigger asChild>
                <div className="min-w-0 flex-1 cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {successFullUse ? (
                        <TicketCheck className="h-5 w-5 text-primary/80" />
                      ) : (
                        <TicketX className="h-5 w-5 text-destructive/80" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {displayName ? (
                          <>
                            <User className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="truncate font-medium">
                              {displayName}
                            </div>
                          </>
                        ) : (
                          <div className="truncate font-medium">
                            {t("PassUsage")}
                          </div>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Lock className="h-3.5 w-3.5" />
                          <span>
                            {u.lockerNumber
                              ? t("LockerWithNumber", {
                                  number: u.lockerNumber,
                                })
                              : t("LockerWithNumber", { number: t("None") })}
                          </span>
                        </div>

                        {successFullUse ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {end
                                ? formatTimeOnly(start)
                                : `${formatTimeOnly(start)} · ${elapsedLabel}`}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {isGymEmployee //because gym employees see today's usages but user can see all of theirs
                              ? formatTimeOnly(start)
                              : formatDateTime(start)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>

              <div className="shrink-0 flex items-center gap-3">
                {showManageGymPassUsageButtons(
                  isInRole,
                  successFullUse,
                  end,
                ) && (
                  <div className="flex items-center gap-2 mr-10">
                    <EndGymSessionDialog gymPassUsageId={u.id} />
                    <UpdateGymPassUsageLockerNumberDialog
                      gymPassUsageId={u.id}
                      currentLockerNumber={u.lockerNumber}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {successFullUse && !end && (
                    <Badge variant="outline">{t("CurrentlyTraining")}</Badge>
                  )}

                  <Badge
                    variant={getPassUsageResultBadgeVariant(u.passUseResult)}
                  >
                    {passUseResultLabel}
                  </Badge>

                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CollapsibleContent>
            <Separator />
            <div className="px-5 pb-5 pt-0">
              <div className="pt-4 grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      {t("Session")}
                    </p>

                    <GymPassUsageSessionDateTimeDetails
                      start={start}
                      end={end}
                      elapsed={elapsedLabel}
                      passUseResult={u.passUseResult}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {t(`${u.passType}PassLabel`)}
                    </Badge>
                    <Badge
                      variant={getPassUsageResultBadgeVariant(u.passUseResult)}
                    >
                      {passUseResultLabel}
                    </Badge>
                    {u.lockerNumber && (
                      <Badge variant="secondary">
                        {t("LockerWithNumber", { number: u.lockerNumber })}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      {t("PassDetails")}
                    </p>

                    <div className="text-sm space-y-1">
                      {u.passType === "Unlimited" ? (
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">
                            {t("ExpirationDate")}
                          </span>
                          <span className="font-medium">
                            {formatDateTime(u.passExpirationDate as any)}
                          </span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-[230px_minmax(0,1fr)] gap-x-4 gap-y-2">
                          <span className="text-muted-foreground">
                            {t("TotalUses")}
                          </span>
                          <span className="font-medium tabular-nums">
                            {u.totalPassUses ?? "—"}
                          </span>

                          <span className="text-muted-foreground">
                            {t("RemainingUses")}
                          </span>
                          <span className="font-medium tabular-nums">
                            {u.remainingPassUses ?? "—"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
