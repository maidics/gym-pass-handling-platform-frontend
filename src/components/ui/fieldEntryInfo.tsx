import { cn } from "@lib/utils";
import type { LucideIcon } from "lucide-react";

type FieldEntryVariant = "justified" | "inline" | "stacked";

interface FieldEntryInfoProps {
  icon?: LucideIcon;
  label: string;
  value: string | undefined;
  bold?: boolean;

  variant?: FieldEntryVariant;
  stackedAlign?: "start" | "end" | "center";
  truncate?: boolean;

  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  iconClassName?: string;
}

export function FieldEntryInfo({
  icon: Icon,
  label,
  value,
  bold,
  variant = "justified",
  stackedAlign = "start",
  truncate = true,
  className,
  labelClassName,
  valueClassName,
  iconClassName,
}: FieldEntryInfoProps) {
  const isStacked = variant === "stacked";

  const stackedTextAlign =
    stackedAlign === "start"
      ? "items-start text-left"
      : stackedAlign === "end"
        ? "items-end text-right"
        : "items-center text-center";

  if (isStacked) {
    return (
      <div className={cn("w-full min-w-0 flex items-center gap-3", className)}>
        {Icon && (
          <Icon
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground",
              iconClassName,
            )}
          />
        )}

        <div className={cn("min-w-0 flex flex-col", stackedTextAlign)}>
          <span
            className={cn(
              "text-sm font-medium text-muted-foreground",
              bold && "font-bold",
              labelClassName,
            )}
          >
            {label}
          </span>

          <span
            className={cn(
              "min-w-0 text-foreground wrap-break-word",
              bold && "font-bold",
              valueClassName,
            )}
            title={value}
          >
            {value ?? "-"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full min-w-0 flex items-center gap-3", className)}>
      <span
        className={cn(
          "text-sm font-medium text-muted-foreground whitespace-nowrap",
          bold && "font-bold",
          "flex items-center gap-2",
          labelClassName,
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground",
              iconClassName,
            )}
          />
        )}
        {label}
      </span>

      <span
        className={cn(
          "min-w-0 text-foreground",
          bold && "font-bold",
          variant === "justified" && "ml-auto text-right",
          variant === "inline" && "text-left",
          (variant === "justified" || variant === "inline") &&
            (truncate ? "truncate" : "break-words"),
          valueClassName,
        )}
        title={value}
      >
        {value ?? "-"}
      </span>
    </div>
  );
}
