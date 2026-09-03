import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { PageHeader } from "@components/pages/PageHeader";
import { CheckoutForm } from "@components/checkout/CheckoutForm";
import { useCreateGymPassProductOneTimePaymentIntent } from "@hooks/gymPassProducts/useCreateGymPassProductOneTimePaymentIntent";
import { useGetGymPassProductById } from "@hooks/gymPassProducts/useGetGymPassProducts.ts";
import { useGetGymById } from "@hooks/gyms/useGetGyms.ts";
import { LoadingSkeleton } from "@ui/loadingSkeleton.tsx";
import { FieldEntryInfo } from "@ui/fieldEntryInfo.tsx";
import { Separator } from "@ui/separator.tsx";
import { formatMoney } from "@lib/moneyUtils.ts";

export function Checkout() {
  const { t } = useTranslation();
  const { gymPassProductId } = useParams<{ gymPassProductId: string }>();

  const {
    mutateAsync: createPaymentIntent,
    isPending: isPaymentIntentCreationPending,
  } = useCreateGymPassProductOneTimePaymentIntent();

  const { data: gymPassProduct, isPending: isGymPassProductPending } =
    useGetGymPassProductById(gymPassProductId!);

  const isUnlimited = gymPassProduct?.type === "Unlimited";

  const { gym, isLoading: isGymLoading } = useGetGymById(gymPassProduct?.gymId);

  const isDetailsLoading = isGymPassProductPending || isGymLoading;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentAccountId, setPaymentAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (!gymPassProductId) return;

    let cancelled = false;

    (async () => {
      const result = await createPaymentIntent({ gymPassProductId });
      if (cancelled) return;

      setClientSecret(result.clientSecret);
      setPaymentAccountId(result.tenantPaymentAccountId);
    })();

    return () => {
      cancelled = true;
    };
  }, [gymPassProductId, createPaymentIntent]);

  const stripePromise = useMemo<Promise<Stripe | null> | null>(() => {
    if (!paymentAccountId) return null;

    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

    console.info("Publishable key: ", key);

    return loadStripe(key!, {
      stripeAccount: paymentAccountId,
    });
  }, [paymentAccountId]);

  const options = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance: { theme: "stripe" as const },
          }
        : undefined,
    [clientSecret],
  );

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader showBackButton title="" />

      <div className="mx-auto w-full max-w-5xl animate-in fade-in duration-300 min-w-0">
        <div className="grid gap-6 lg:grid-cols-5 min-w-0">
          <Card className="lg:col-span-3 min-w-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                {t("PaymentCheckout")}
              </CardTitle>
            </CardHeader>

            <CardContent className="min-w-0">
              {!stripePromise || !options ? (
                <div className="space-y-3">
                  <div className="h-6 w-40 rounded bg-muted/60" />
                  <div className="h-10 w-full rounded bg-muted/60" />
                  <div className="h-10 w-full rounded bg-muted/60" />
                  <div className="h-10 w-full rounded bg-muted/60" />
                </div>
              ) : (
                <Elements
                  key={clientSecret}
                  stripe={stripePromise}
                  options={options}
                >
                  <CheckoutForm
                    isLoadingIntent={isPaymentIntentCreationPending}
                  />
                </Elements>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 lg:sticky lg:top-6 h-fit min-w-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                {t("Summary")}
              </CardTitle>
            </CardHeader>

            <Separator className="mb-3" />

            <CardContent className="space-y-3 text-sm min-w-0">
              {isDetailsLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  <FieldEntryInfo label={t("Gym")} value={gym?.name} />

                  <FieldEntryInfo
                    label={t("Pass")}
                    value={gymPassProduct?.name}
                  />

                  <FieldEntryInfo
                    label={t("Type")}
                    value={t(gymPassProduct?.type ?? "-")}
                  />

                  <FieldEntryInfo
                    label={
                      isUnlimited ? t("DaysAfterExpiring") : t("TotalUses")
                    }
                    value={
                      isUnlimited
                        ? gymPassProduct?.daysAfterExpiring?.toString()
                        : gymPassProduct?.totalUses?.toString()
                    }
                  />

                  <Separator />

                  <FieldEntryInfo
                    label={t("Price")}
                    value={formatMoney(gymPassProduct?.price)}
                    bold
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
