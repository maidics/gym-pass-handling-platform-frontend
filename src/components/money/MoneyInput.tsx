import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { formatMoney, MoneyFormErrors } from "@lib/moneyUtils.ts";
import { CurrencyCode, Money } from "@api/types.ts";
import { useCurrencyRules } from "@hooks/referenceData/useReferenceData.ts";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Label } from "@ui/label.tsx";
import { useEffect } from "react";

interface MoneyInputProps {
  data: Money;
  errors?: MoneyFormErrors;
  isLoading: boolean;
  onChange: (field: keyof Money, value: number | CurrencyCode) => void;
}

export function MoneyInput({
  data,
  errors,
  isLoading,
  onChange,
}: MoneyInputProps) {
  const { t } = useTranslation();
  const { data: currencyRules, isLoading: isCurrencyRulesLoading } =
    useCurrencyRules();

  const currencyCodes = currencyRules?.map((x) => x.currencyCode) ?? [];

  const rule = currencyRules?.find((r) => r.currencyCode === data.currency);
  const minAmount = rule?.minAmount;
  const step = data.currency === "HUF" ? 1 : 0.1;

  useEffect(() => {
    //changes min on amount input when it loads
    if (minAmount == null) return;
    if (data.amount < minAmount) onChange("amount", minAmount);
  }, [minAmount, data.amount, onChange]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor="gpp-price" required>
        {t("Price")}
      </Label>
      <div className="flex gap-2">
        <Input
          id="gpp-price"
          type="number"
          required
          step={step}
          min={minAmount}
          value={data.amount}
          onChange={(e) => onChange("amount", Number(e.target.value))}
          className="flex-1"
          disabled={isLoading || isCurrencyRulesLoading}
          error={errors?.amount}
        />

        <Select
          value={data.currency}
          onValueChange={(x) => onChange("currency", x as CurrencyCode)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencyCodes.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {minAmount != null && (
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0" />
          <div
            className="min-w-0 truncate whitespace-nowrap"
            title={
              "Minimum: " +
              formatMoney({
                amount: minAmount,
                currency: data.currency,
              })
            }
          >
            Minimum:{" "}
            {formatMoney({
              amount: minAmount,
              currency: data.currency,
            })}
          </div>
        </div>
      )}
    </div>
  );
}
