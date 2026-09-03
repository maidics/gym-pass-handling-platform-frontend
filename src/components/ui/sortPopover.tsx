import * as React from "react";
import { ArrowUpDown, Check } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@lib/utils.ts";

export type SortOrder = "asc" | "desc";

export type SortValue<TField extends string> = {
  by: TField;
  order: SortOrder;
};

export type SortItem<TField extends string> = SortValue<TField> & {
  label: React.ReactNode;
};

type SortPopoverProps<TField extends string> = {
  value: SortValue<TField>;
  onChange: (next: SortValue<TField>) => void;

  items: SortItem<TField>[];

  triggerLabel?: React.ReactNode;
  title?: React.ReactNode;

  align?: "start" | "center" | "end";
  contentClassName?: string;
  triggerClassName?: string;
};

export function SortPopover<TField extends string>({
  value,
  onChange,
  items,
  triggerLabel = "Sort",
  title = "Sort",
  align = "end",
  contentClassName = "w-56",
  triggerClassName,
}: SortPopoverProps<TField>) {
  const selected = React.useMemo(() => {
    return items.find((i) => i.by === value.by && i.order === value.order);
  }, [items, value.by, value.order]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={triggerClassName}>
          <ArrowUpDown className="h-4 w-4 mr-2" />
          <span className="truncate">{selected?.label ?? triggerLabel}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className={contentClassName} align={align}>
        <div className="space-y-2">
          <div className="font-medium">{title}</div>

          <div className="space-y-1">
            {items.map((item) => {
              const active = item.by === value.by && item.order === value.order;

              return (
                <Button
                  key={`${item.by}-${item.order}`}
                  type="button"
                  onClick={() => onChange({ by: item.by, order: item.order })}
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full flex items-center justify-between rounded-md px-2 py-2 text-sm",
                    "hover:bg-accent hover:text-accent-foreground transition-colors",
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  {active && <Check className="h-4 w-4 shrink-0" />}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
