import { GymMembershipPassDto, PassType } from "@api/types.ts";
import { Badge } from "@components/ui/badge.tsx";
import { cn } from "@lib/utils.ts";
import { Button } from "@components/ui/button.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible.tsx";
import { getGymMembershipPassStatus } from "@lib/gymMembershipPassUtils.ts";
import { formatDateTime } from "@lib/dateTimeUtils.ts";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { ChevronDown, QrCode, Ticket } from "lucide-react";
import { getPassTypeConfig } from "@lib/passTypeUtils.ts";

interface GymMembershipPassCardProps {
  pass: GymMembershipPassDto;
  onShowQR: ({ id, type }: { id: string; type: PassType }) => void;
}

export function GymMembershipPassCard({
  pass,
  onShowQR,
}: GymMembershipPassCardProps) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const typeConfig = getPassTypeConfig(pass.type);
  const status = getGymMembershipPassStatus(pass);

  const passName = t(`${pass.type}PassLabel`, {
    totalUses: pass.totalUses,
  });

  const passType = t(pass.type);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-foreground">
                      {passName}
                    </h3>
                    <Badge className={cn("border", typeConfig.className)}>
                      {passType}
                    </Badge>
                    <Badge variant={status.isValid ? "default" : "secondary"}>
                      {t(status.labelKey)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(...status.usesRemainingKey)}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-muted-foreground collapsible-chevron" />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 border-t border-border/50">
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("Id")}</p>
                  <p className="font-medium text-foreground">{pass.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("MembershipId")}
                  </p>
                  <p className="font-medium text-foreground">
                    {pass.gymMembershipId}
                  </p>
                </div>
                {(pass.type === "SingleUse" || pass.type === "MultiUse") && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("TotalUses")}
                      </p>
                      <p className="font-medium text-foreground">
                        {pass.totalUses ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("RemainingUses")}
                      </p>
                      <p className="font-medium text-foreground">
                        {pass.remainingUses ?? 0}
                      </p>
                    </div>
                  </>
                )}
                {pass.type === "Unlimited" && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("ExpirationDate")}
                    </p>
                    <p className="font-medium text-foreground">
                      {formatDateTime(pass.expirationDate)}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => onShowQR({ id: pass.id, type: pass.type })}
                  className="gap-2"
                  disabled={!status.isValid}
                >
                  <QrCode className="h-4 w-4" />
                  {t("QRCode")}
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
