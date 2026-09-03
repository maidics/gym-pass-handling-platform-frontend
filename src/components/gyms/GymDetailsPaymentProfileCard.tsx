import { AlertTriangle, CreditCard, SquareArrowOutUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Separator } from "@ui/separator";
import { useTranslation } from "react-i18next";
import { GymDto } from "@api/types.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "@ui/button.tsx";
import { SetupTenantPaymentProfileDialog } from "@components/tenantPaymentProfile/SetupTenantPaymentProfileDialog.tsx";

export function GymPaymentProfileCard({
  gym,
  openPaymentProfileSetup = false,
}: {
  gym: GymDto;
  openPaymentProfileSetup?: boolean;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = gym.paymentProfile;

  return (
    <div className="relative">
      {profile && (
        <Button
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          variant="ghost"
          onClick={() => navigate("/payment-profile")}
        >
          <SquareArrowOutUpRight className="h-4 w-4" />
        </Button>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            {" " + t("PaymentProfile")}
          </CardTitle>
        </CardHeader>

        <Separator className="mb-3" />

        <CardContent>
          {profile ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-foreground text-right break-words">
                    {t("ManageConnectedPaymentAccount")}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-full space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">{t("NotCreated")}</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {t("SetupPaymentProfileDescription")}
                </p>

                <SetupTenantPaymentProfileDialog
                  defaultOpen={openPaymentProfileSetup}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
