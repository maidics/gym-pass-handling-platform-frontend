import { FunnelX, ListX, LucideIcon } from "lucide-react";
import { Button } from "@ui/button.tsx";
import { useTranslation } from "react-i18next";

type NoItemFoundByFilterProps = {
  Icon?: LucideIcon;
  titleKey?: string;
  descriptionKey?: string;
  showClearFilter?: boolean;
  onClearFilter?: () => void;
  children?: React.ReactNode;
};

export function NoItemFound({
  Icon,
  titleKey,
  descriptionKey,
  showClearFilter,
  onClearFilter,
  children,
}: NoItemFoundByFilterProps) {
  const { t } = useTranslation();

  const NoItemsFoundIcon = Icon ?? ListX;

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <NoItemsFoundIcon />
      </div>
      <h3 className="text-lg font-medium text-foreground">
        {titleKey ? t(titleKey) : t("TheresNothingToShowHere")}
      </h3>
      <h4 className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider">
        {descriptionKey
          ? t(descriptionKey)
          : showClearFilter
            ? t("TryAdjustingFilters")
            : ""}
      </h4>
      {showClearFilter && (
        <Button
          variant="ghost"
          onClick={onClearFilter}
          className="mt-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <FunnelX />
          {t("ClearFilter")}
        </Button>
      )}
      {children}
    </div>
  );
}
