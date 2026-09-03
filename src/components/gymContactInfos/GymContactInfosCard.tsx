import { Users, Mail, Phone, MapPin, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { useTranslation } from "react-i18next";
import { GymDto, Address } from "@api/types";
import { Separator } from "@ui/separator";
import { Label } from "@ui/label";
import { useAuth } from "@hooks/user/useAuth";
import { DeleteGymContactInfoDialog } from "@components/gymContactInfos/DeleteGymContactInfoDialog";
import { UpdateGymContactInfoDialog } from "@components/gymContactInfos/UpdateGymContactInfoDialog";
import { CreateGymContactInfoDialog } from "@components/gymContactInfos/CreateGymContactInfoDialog";
import { showManageGymContactInfoButtons } from "@lib/permissions";
import { cn } from "@lib/utils";

const formatAddressString = (address?: Address | null) => {
  if (!address) return "—";
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postalCode,
    address.countryAlpha2,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "—";
};

export function GymContactInfosCard({
  gym,
  className,
}: {
  gym: GymDto;
  className?: string;
}) {
  const { t } = useTranslation();
  const { isInRole, isManagedGym } = useAuth();

  const showManageContactButtons = showManageGymContactInfoButtons(
    isInRole,
    isManagedGym,
    gym.id,
  );

  return (
    <Card className={cn("flex flex-col min-h-0 min-w-0", className)}>
      <CardHeader className="pb-3 shrink-0">
        <div className="flex justify-between gap-3 min-w-0">
          <CardTitle className="flex items-center gap-2 text-base font-medium min-w-0">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{t("Contacts")}</span>
          </CardTitle>

          {showManageContactButtons && <CreateGymContactInfoDialog />}
        </div>
      </CardHeader>

      <Separator className="shrink-0" />

      <CardContent className="pt-4 flex-1 min-h-0 min-w-0">
        <div className="space-y-6 pr-3 min-w-0 lg:h-full lg:overflow-y-auto">
          {gym.contactInfos.length > 0 ? (
            gym.contactInfos.map((contact, i) => (
              <div
                key={contact.id ?? i}
                className="relative space-y-3 pr-10 min-w-0"
              >
                {showManageContactButtons && (
                  <div className="absolute right-0 top-0">
                    <UpdateGymContactInfoDialog contact={contact} />
                    <DeleteGymContactInfoDialog gymContactInfoId={contact.id} />
                  </div>
                )}

                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium uppercase shrink-0 mt-1">
                    {contact.fullName.substring(0, 2)}
                  </div>

                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="space-y-0.5 min-w-0">
                      <Label className="text-[10px] uppercase text-muted-foreground tracking-wider">
                        {t("Name")}
                      </Label>
                      <p className="text-sm font-medium leading-none break-words">
                        {contact.fullName}
                      </p>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <Label className="text-[10px] uppercase text-muted-foreground tracking-wider flex items-center gap-1">
                        <Mail className="h-3 w-3 shrink-0" />
                        Email
                      </Label>
                      <p className="text-xs break-all">
                        {contact.email || "—"}
                      </p>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <Label className="text-[10px] uppercase text-muted-foreground tracking-wider flex items-center gap-1">
                        <Phone className="h-3 w-3 shrink-0" />
                        {t("Phone")}
                      </Label>
                      <p className="text-xs">
                        {contact.phoneNumber?.value || "—"}
                      </p>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <Label className="text-[10px] uppercase text-muted-foreground tracking-wider flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {t("BusinessAddress")}
                      </Label>
                      <p className="text-xs leading-relaxed text-muted-foreground/90 break-words">
                        {formatAddressString(contact.address)}
                      </p>
                    </div>
                  </div>
                </div>

                {i < gym.contactInfos.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground font-medium py-6">
              <Info className="w-3 h-3" />
              <span>{t("NoGymContactInfoCreatedYet")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
