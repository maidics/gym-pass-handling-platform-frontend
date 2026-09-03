import { useTranslation } from "react-i18next";
import {
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@ui/button.tsx";
import { Loader2, ShieldCheck } from "lucide-react";

export function CheckoutForm({
  isLoadingIntent,
}: {
  isLoadingIntent: boolean;
}) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const confirm = async () => {
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:5173/passes`,
      },
    });

    if (error) setErrorMessage(error.message ?? t("PaymentFailed"));
    setIsSubmitting(false);
  };

  const disabled = isLoadingIntent || isSubmitting || !stripe || !elements;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground mb-3">
          {t("FastCheckoutOptions")}
        </p>

        <ExpressCheckoutElement
          onConfirm={async () => {
            await confirm();
          }}
        />
      </div>

      <div className="relative">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {errorMessage && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <Button className="w-full gap-2" onClick={confirm} disabled={disabled}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("Processing")}
          </>
        ) : (
          t("Pay")
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4" />
        <span>{t("SecuredByStripe")}</span>
      </div>
    </div>
  );
}
