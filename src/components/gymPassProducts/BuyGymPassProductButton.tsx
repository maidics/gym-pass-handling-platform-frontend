import { roles } from "@constants/roles.ts";
import { CreditCard } from "lucide-react";
import { Button } from "@ui/button.tsx";
import { useAuth } from "@hooks/user/useAuth.ts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface BuyGymPassProductButtonProps {
  productId: string;
  isProductActive: boolean;
}

export function BuyGymPassProductButton({
  productId,
  isProductActive,
}: BuyGymPassProductButtonProps) {
  const { t } = useTranslation();
  const { isInRole } = useAuth();
  const navigate = useNavigate();

  const onPurchase = (gymPassProductId: string) => {
    navigate(`/checkout/${encodeURIComponent(gymPassProductId)}`);
  };

  const disabled = !isInRole(roles.User) || !isProductActive;

  return (
    <Button
      size="sm"
      variant="default"
      className="gap-2"
      disabled={disabled}
      disabledTooltip={
        !isInRole(roles.User)
          ? t("OnlyUserRoleCanBuyPasses")
          : t("CurrentlyUnavailable")
      }
      onClick={() => onPurchase(productId)}
    >
      <CreditCard className="h-4 w-4" />
      {t("Purchase")}
    </Button>
  );
}
