import { Calendar, User } from "lucide-react";
import { TenantPaymentProfileDto } from "@api/types.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card.tsx";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "@lib/dateTimeUtils.ts";

interface MetadataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}

function MetadataItem({ icon, label, value }: MetadataItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">
          {value || <span className="text-muted-foreground italic">—</span>}
        </p>
      </div>
    </div>
  );
}

interface PaymentProfileMetadataProps {
  profile: TenantPaymentProfileDto;
}

export function TenantPaymentProfileMetadata({
  profile,
}: PaymentProfileMetadataProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("Details")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <MetadataItem
          icon={<User className="h-4 w-4" />}
          label={`${t("PaymentProfile")} ${t("CreatedOn")}`}
          value={formatDateTime(profile.createdOn)}
        />

        <MetadataItem
          icon={<Calendar className="h-4 w-4" />}
          label={t("LastAccountLinkGeneratedOn")}
          value={formatDateTime(profile.lastAccountLinkGeneratedOn)}
        />

        <MetadataItem
          icon={<User className="h-4 w-4" />}
          label={t("AccountLinkGeneratedBy")}
          value={profile.lastAccountLinkGeneratedBy}
        />
      </CardContent>
    </Card>
  );
}
