import { ReactNode, useState } from "react";
import { ExternalLink, LogIn, Settings, Loader2 } from "lucide-react";
import { Button } from "@ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card.tsx";
import { useGeneratePaymentProviderLink } from "@hooks/tenantPaymentProfiles/useTenantPaymentProfile.tsx";
import { useTranslation } from "react-i18next";

export type PaymentProviderLinkType = "LoginLink" | "AccountLink";

interface LinkButtonProps {
  icon: ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  isLoading?: boolean;
  variant?: "default" | "outline" | "secondary";
}

function LinkButton({
  icon,
  label,
  description,
  onClick,
  isLoading,
  variant = "default",
}: LinkButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10 text-primary">{icon}</div>
        <div>
          <p className="font-medium text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <Button
        variant={variant}
        size="sm"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {t("Go")} <ExternalLink className="h-3 w-3 ml-1" />
          </>
        )}
      </Button>
    </div>
  );
}

export function TenantPaymentProfileLinksCard() {
  const { t } = useTranslation();

  const { mutateAsync: generateLink, isPending } =
    useGeneratePaymentProviderLink();

  const [activeType, setActiveType] = useState<PaymentProviderLinkType | null>(
    null,
  );

  const openProviderLink = async (type: PaymentProviderLinkType) => {
    try {
      setActiveType(type);

      const result = await generateLink({ type });
      const url = result?.url;

      if (!url) return;

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
    } finally {
      setActiveType(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("QuickActions")}</CardTitle>
        <CardDescription>
          {t("TenantPaymentProfileLinksCardDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <LinkButton
          icon={<LogIn className="h-4 w-4" />}
          label={t("ExpressDashboard")}
          description={t("StripeExpressDashboardDescription")}
          onClick={() => openProviderLink("LoginLink")}
          isLoading={isPending && activeType === "LoginLink"}
        />

        <LinkButton
          icon={<Settings className="h-4 w-4" />}
          label={t("UpdateAccount")}
          description={t("UpdateStripeAccountDescription")}
          onClick={() => openProviderLink("AccountLink")}
          isLoading={isPending && activeType === "AccountLink"}
          variant="outline"
        />
      </CardContent>
    </Card>
  );
}
