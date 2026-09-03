import { useState } from "react";
import { ChevronDown, ChevronUp, TicketX } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@hooks/user/useAuth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/collapsible";
import { Button } from "@components/ui/button";
import { CreateGymPassProductDialog } from "@components/gymPassProducts/CreateGymPassProductDialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { useUpdateMyGymPassProductActiveStatus } from "@hooks/gymPassProducts/useUpdateGymPassProduct";
import { LoadingSkeleton } from "@ui/loadingSkeleton";
import { GymPassProductsTable } from "@components/gymPassProducts/GymPassProductsTable";
import { useGetGymById } from "@hooks/gyms/useGetGyms";
import { GymPassProductsHeader } from "@components/gymPassProducts/GymPassProductsHeader";
import type { GymPassProductDto } from "@api/types";
import { useGetGymPassProducts } from "@hooks/gymPassProducts/useGetGymPassProducts";
import { showCreateGymPassProductButton } from "@lib/permissions";

export default function GymPassProducts() {
  const { t } = useTranslation();
  const { user, isInRole, isManagedGym } = useAuth();
  const { id: gymId } = useParams<{ id: string }>();

  const { data: products, isLoading } = useGetGymPassProducts(gymId!);
  const { gym, isLoading: isGymLoading } = useGetGymById(
    products ? gymId : undefined,
  );

  const hasPaymentProfile = !!gym?.paymentProfile;
  const createPassDisabled = !hasPaymentProfile || isGymLoading;

  const myGymSetupUrl = user
    ? `/gyms/${user.gymId}?openPaymentProfileSetup=true`
    : undefined;

  const updateStatus = useUpdateMyGymPassProductActiveStatus();

  const [showStats, setShowStats] = useState(true);

  const totalProducts = products?.length ?? 0;
  const activeProducts = products?.filter((p) => p.isActive) ?? [];
  const inactiveProducts = products?.filter((p) => !p.isActive) ?? [];

  const stats = [
    {
      label: t("TotalProducts"),
      value: totalProducts,
      color: "border-l-primary",
    },
    {
      label: t("Active"),
      value: activeProducts.length,
      color: "border-l-green-500",
    },
    {
      label: t("Inactive"),
      value: inactiveProducts.length,
      color: "border-l-muted-foreground",
    },
  ];

  const handleToggleStatus = async (product: GymPassProductDto) => {
    await updateStatus.mutateAsync({
      gymPassProductId: product.id,
      isActive: !product.isActive,
    });
  };

  const createPassDisabledTooltip =
    !hasPaymentProfile && myGymSetupUrl ? (
      <div className="max-w-xs space-y-1 text-center">
        <p>{t("RequiresStripeAccount")}</p>
        <Link
          to={myGymSetupUrl}
          className="inline-flex font-medium text-primary underline underline-offset-2"
        >
          {t("SetupNow")}
        </Link>
      </div>
    ) : undefined;

  const isBusy = isLoading || isGymLoading;

  return (
    <div className="space-y-6 min-w-0">
      <GymPassProductsHeader
        isLoading={isLoading}
        createGymPassProductDialogDisabled={createPassDisabled}
        createGymPassProductDialogDisabledToolTip={createPassDisabledTooltip}
        productsLength={totalProducts}
        gymId={gymId}
      />

      {isBusy ? (
        <LoadingSkeleton />
      ) : (
        <>
          <Collapsible open={showStats} onOpenChange={setShowStats}>
            <div className="mb-2 flex items-center justify-between min-w-0">
              <span className="text-sm font-medium text-muted-foreground">
                {t("Overview")}
              </span>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 shrink-0">
                  {showStats ? (
                    <>
                      <ChevronUp className="mr-1 h-4 w-4" />
                      {t("Hide")}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-1 h-4 w-4" />
                      {t("Show")}
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className={`border-l-4 ${stat.color} min-w-0`}
                  >
                    <CardHeader className="p-3 pb-1">
                      <CardDescription className="text-xs">
                        {stat.label}
                      </CardDescription>
                      <CardTitle className="text-xl">{stat.value}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {totalProducts === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center min-w-0">
              <TicketX className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                {t("NoPassProductsTitle")}
              </h3>
              <p className="mb-4 text-muted-foreground max-w-lg">
                {t("NoPassProductsDescription")}
              </p>

              {showCreateGymPassProductButton(
                isInRole,
                isManagedGym,
                gymId,
              ) && (
                <CreateGymPassProductDialog
                  disabled={createPassDisabled}
                  disabledToolTip={createPassDisabledTooltip}
                />
              )}
            </div>
          ) : (
            <GymPassProductsTable
              products={products ?? []}
              isUpdating={updateStatus.isPending}
              onToggleActive={handleToggleStatus}
            />
          )}
        </>
      )}
    </div>
  );
}
