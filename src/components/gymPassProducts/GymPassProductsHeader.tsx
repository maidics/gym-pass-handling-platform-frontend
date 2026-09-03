import { PageHeader, PageHeaderItem } from "@components/pages/PageHeader";
import { TicketPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@hooks/user/useAuth.ts";
import { CreateGymPassProductDialog } from "@components/gymPassProducts/CreateGymPassProductDialog.tsx";
import { ReactNode } from "react";
import { showCreateGymPassProductButton } from "@lib/permissions.ts";

interface GymPassProductsHeaderProps {
  createGymPassProductDialogDisabled: boolean;
  createGymPassProductDialogDisabledToolTip: ReactNode;
  isLoading: boolean;
  productsLength: number;
  gymId?: string;
}

export function GymPassProductsHeader({
  createGymPassProductDialogDisabled,
  createGymPassProductDialogDisabledToolTip,
  isLoading,
  productsLength,
  gymId,
}: GymPassProductsHeaderProps) {
  const { t } = useTranslation();
  const { isInRole, isManagedGym } = useAuth();

  const primaryTools: PageHeaderItem[] = [];

  showCreateGymPassProductButton(isInRole, isManagedGym, gymId) &&
    primaryTools.push({
      id: "createProduct",
      index: 0,
      node: (
        <CreateGymPassProductDialog
          disabled={createGymPassProductDialogDisabled}
          disabledToolTip={createGymPassProductDialogDisabledToolTip}
        />
      ),
    });

  return (
    <PageHeader
      title={t("PassProducts")}
      subtitle={t("GymPassProductsPageDescription")}
      icon={<TicketPlus className="h-6 w-6 text-primary" />}
      showBackButton
      primaryToolbar={primaryTools}
      metaDisplay={
        isLoading
          ? undefined
          : productsLength === 0
            ? t("NoPassProductsCreatedYet")
            : t("ShowingResults", { count: productsLength })
      }
    />
  );
}
