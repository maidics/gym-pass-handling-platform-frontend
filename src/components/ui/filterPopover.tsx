import * as React from "react";
import { Filter as FilterIcon, FunnelX } from "lucide-react";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { useTranslation } from "react-i18next";

type Option = { value: string; label: React.ReactNode };

type SelectField<T extends Record<string, string>> = {
  type: "select";
  key: keyof T;
  label: React.ReactNode;
  options: Option[];
};

type FilterPopoverProps<T extends Record<string, string>> = {
  value: T;
  defaults: T;
  onChange: (next: T) => void;

  fields: SelectField<T>[];

  triggerLabel: React.ReactNode;
  title?: React.ReactNode;

  contentClassName?: string;
  align?: "start" | "center" | "end";
};

export function FilterPopover<T extends Record<string, string>>({
  value,
  defaults,
  onChange,
  fields,
  triggerLabel,
  title = "Filters",
  contentClassName = "w-80",
  align = "end",
}: FilterPopoverProps<T>) {
  const { t } = useTranslation();

  const activeCount = React.useMemo(() => {
    return (Object.keys(defaults) as (keyof T)[]).reduce((sum, k) => {
      return sum + (value[k] !== defaults[k] ? 1 : 0);
    }, 0);
  }, [value, defaults]);

  const clear = () => onChange(defaults);

  const setField = (key: keyof T, nextValue: string) => {
    onChange({ ...value, [key]: nextValue } as T);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FilterIcon className="h-4 w-4" />
          {triggerLabel}
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className={contentClassName} align={align}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{title}</h4>
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="text-destructive hover:text-destructive"
              >
                <FunnelX className="h-4 w-4 text-destructive" />
                {t("Clear")}
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {fields.map((f) => {
              if (f.type !== "select") return null;

              return (
                <div key={String(f.key)} className="space-y-1.5">
                  <label className="text-sm font-medium">{f.label}</label>
                  <Select
                    value={value[f.key]}
                    onValueChange={(v) => setField(f.key, v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
