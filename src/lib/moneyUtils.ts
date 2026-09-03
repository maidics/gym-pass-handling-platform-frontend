import { CurrencyRule, Money } from "@api/types.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { TFunction } from "i18next";
import i18n from "../i18n.ts";

export const formatMoney = (money: Money | undefined | null) => {
  if (!money) return "NotAvailable";

  return new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: money.currency || "USD",
  }).format(money.amount);
};

export type MoneyFormErrors = FormErrors<Money>;

export const validateMoney = (
  money: Money,
  t: TFunction<"translation", undefined>,
  currencyRules: CurrencyRule[],
) => {
  const errors: MoneyFormErrors = {};

  const currencies = currencyRules.map((x) => x.currencyCode.toString());

  if (!currencies.includes(money.currency)) {
    errors.currency = t("InvalidValue", { value: t("Currency") });
  }

  const currencyRule = currencyRules.find(
    (x) => x.currencyCode == money.currency,
  );

  if (money.amount < currencyRule!.minAmount) {
    errors.amount = t("MinPriceRule", {
      currency: money.currency,
      amount: money.amount,
    });
  }

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
};
