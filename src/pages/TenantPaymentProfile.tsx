import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@hooks/user/useAuth";
import { useGetMyTenantPaymentProfile } from "@hooks/tenantPaymentProfiles/useTenantPaymentProfile";
import { TenantPaymentProfileMetadata } from "@components/tenantPaymentProfile/TenantPaymentProfileMetadata";
import { TenantPaymentProfileLinksCard } from "@components/tenantPaymentProfile/TenantPaymentProfileLinksCard";
import { LoadingSkeleton } from "@ui/loadingSkeleton";
import { ItemNotFound } from "@ui/itemNotFound";
import { PageHeader } from "@components/pages/PageHeader";

export default function TenantPaymentProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useGetMyTenantPaymentProfile();

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        showBackButton
        title={t("PaymentProfile")}
        subtitle={
          !error && profile ? t("ManageConnectedPaymentAccount") : undefined
        }
        icon={<CreditCard className="h-6 w-6 text-primary" />}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : error || !profile ? (
        <ItemNotFound
          resourceName="PaymentProfile"
          navigateBackToPagePath={`/gyms/${user!.gymId!}`}
          backToPageButtonLabel="MyGym"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 min-w-0">
          <div className="space-y-6 min-w-0">
            <TenantPaymentProfileLinksCard />
          </div>

          <div className="space-y-6 min-w-0">
            <TenantPaymentProfileMetadata profile={profile} />
          </div>
        </div>
      )}
    </div>
  );
}
