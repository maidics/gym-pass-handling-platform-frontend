import { useTranslation } from "react-i18next";
import { cn } from "@lib/utils.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdownMenu.tsx";
import { Button } from "./button.tsx";
import { ChevronDown, X } from "lucide-react";

interface FilterableHeaderProps {
  title: string;
  currentValue: string;
  onSelect: (value: any) => void;
  options: string[];
  align?: "left" | "center" | "right";
}

export function FilterableHeader({
  title,
  currentValue,
  onSelect,
  options,
  align = "left",
}: FilterableHeaderProps) {
  const { t } = useTranslation();
  const isActive = currentValue !== "all";

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        align === "right" && "justify-end",
        align === "center" && "justify-center",
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className={cn(
              "h-8 hover:bg-transparent font-semibold text-muted-foreground hover:text-foreground",
              "text-xs sm:text-sm",
              "flex items-center gap-1 px-0",
              isActive && "text-foreground",
            )}
          >
            <span>{title}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[180px]">
          <DropdownMenuItem onClick={() => onSelect("all")}>
            {t("All")}
          </DropdownMenuItem>
          {options.map((option) => (
            <DropdownMenuItem key={option} onClick={() => onSelect(option)}>
              {t(option)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-5 w-5 rounded-full text-muted-foreground hidden sm:flex filter-clear-btn",
          isActive ? "filter-clear-btn--visible" : "filter-clear-btn--hidden",
        )}
        onClick={() => onSelect("all")}
        title={t("Clear")}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
