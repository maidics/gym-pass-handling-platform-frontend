import { useEffect, useState } from "react";
import { Wrench, Mail, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { useTranslation } from "react-i18next";
import { useSetupTenantPaymentProfileForm } from "@hooks/tenantPaymentProfiles/useSetupTenantPaymentProfileForm.tsx";

interface SetupTenantPaymentProfileDialogProps {
  defaultOpen?: boolean;
}

export function SetupTenantPaymentProfileDialog({
  defaultOpen = false,
}: SetupTenantPaymentProfileDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(defaultOpen);

  const {
    data,
    handleChange,
    errors,
    handleSubmit,
    isLoading,
    paymentProviderLink,
    redirectCountdown,
  } = useSetupTenantPaymentProfileForm();

  const isRedirectPhase = Boolean(paymentProviderLink);

  useEffect(() => {
    if (defaultOpen) {
      setOpen(true);
    }
  }, [defaultOpen]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setOpen(false);
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Wrench className="h-4 w-4 mr-2" />
          {t("Start")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("SetupPaymentProfile")}</DialogTitle>
          <DialogDescription>
            {t("SetupPaymentProfileDialogDescription")}
          </DialogDescription>
        </DialogHeader>

        {isRedirectPhase ? (
          <div className="space-y-4 py-4">
            <Alert>
              <AlertDescription>
                {t("TenantPaymentProfileStripeRedirectMessage")}
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <span className="ml-2 text-muted-foreground">
                ({redirectCountdown})
              </span>
            </DialogFooter>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                label={t("AccountHolderEmail")}
                startIcon={<Mail className="h-4 w-4" />}
                id="paymentAccountHolderEmail"
                type="email"
                placeholder={t("TenantPaymentProfileAccountHolderEmailExample")}
                required
                value={data.paymentAccountHolderEmail}
                onChange={(e) =>
                  handleChange("paymentAccountHolderEmail", e.target.value)
                }
                error={errors.paymentAccountHolderEmail}
              />
            </div>

            <div className="space-y-2">
              <Input
                label={t("BusinessName")}
                startIcon={<Building2 className="h-4 w-4" />}
                id="businessName"
                placeholder={t("TenantPaymentProfileBusinessNameExample")}
                required
                value={data.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                error={errors.businessName}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("Cancel")}
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {t("Start")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
