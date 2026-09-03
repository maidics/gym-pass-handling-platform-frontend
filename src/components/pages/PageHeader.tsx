import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cn } from "@lib/utils";

export interface PageHeaderItem {
  id?: string;
  index?: number;
  node: ReactNode;
}

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  showBackButton?: boolean;
  labels?: PageHeaderItem[];
  primaryToolbar?: PageHeaderItem[];
  navigationToolbar?: PageHeaderItem[];
  metaDisplay?: ReactNode;
  secondaryToolbar?: PageHeaderItem[];

  sticky?: boolean;
  className?: string;
  contentClassName?: string;
}

const sortByIndex = (items?: PageHeaderItem[]) => {
  if (!items) return [];
  return [...items].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
};

export function PageHeader({
  title,
  subtitle,
  icon,
  showBackButton,
  labels,
  primaryToolbar,
  navigationToolbar,
  metaDisplay,
  secondaryToolbar,
  sticky,
  className,
  contentClassName,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sortedLabels = sortByIndex(labels);
  const sortedPrimary = sortByIndex(primaryToolbar);
  const sortedNavigation = sortByIndex(navigationToolbar);
  const sortedSecondary = sortByIndex(secondaryToolbar);

  const idx = window.history.state?.idx ?? 0;
  const showBack = showBackButton && idx > 0;

  return (
    <div
      className={cn(
        sticky &&
          "sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b",
        className,
      )}
    >
      <div className={cn("space-y-3 sm:space-y-4 min-w-0", contentClassName)}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="-ml-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                {t("Back")}
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <div className="mr-0 sm:mr-2 flex flex-wrap gap-1 min-w-0">
              {sortedLabels.map((item, idx) => (
                <span key={item.id ?? idx}>{item.node}</span>
              ))}
            </div>
            {sortedPrimary.map((item, idx) => (
              <span key={item.id ?? idx}>{item.node}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-6 min-w-0">
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                {icon}
              </div>
            )}

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight break-words">
                {title}
              </h1>
              {subtitle && (
                <div className="text-xs sm:text-sm text-muted-foreground break-words">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {(navigationToolbar || metaDisplay || secondaryToolbar) && (
            <div className="flex flex-col gap-2 lg:items-end min-w-0">
              {sortedNavigation.map((item, idx) => (
                <span key={item.id ?? idx}>{item.node}</span>
              ))}

              {(metaDisplay || secondaryToolbar) && (
                <div className="flex flex-col gap-1 lg:items-end min-w-0">
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end min-w-0">
                    {sortedSecondary.map((item, idx) => (
                      <span key={item.id ?? idx}>{item.node}</span>
                    ))}
                  </div>

                  {metaDisplay && (
                    <div className="text-xs sm:text-sm text-muted-foreground lg:text-right">
                      {metaDisplay}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
