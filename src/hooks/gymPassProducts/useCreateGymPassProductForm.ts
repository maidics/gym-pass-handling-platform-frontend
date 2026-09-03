import { useState, useCallback, FormEvent } from "react";
import { CreateGymPassProductCommand, PassType, Money } from "@api/types";
import { useCreateGymPassProduct } from "@hooks/gymPassProducts/useGymPassProducts";
import { MoneyFormErrors, validateMoney } from "@lib/moneyUtils.ts";
import { useCurrencyRules } from "@hooks/referenceData/useReferenceData.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { useTranslation } from "react-i18next";
import { validate } from "@lib/validationUtils.ts";

export interface CreateGymPassProductFormData {
  name: string;
  description: string;
  passType: PassType;
  totalUses?: number;
  daysAfterExpires?: number;
  isActive: boolean;
  price: Money;
}

type CreateGymPassProductFormErrors = Omit<
  FormErrors<CreateGymPassProductFormData>,
  "price"
> & { price?: MoneyFormErrors };

export const useCreateGymPassProductForm = (
  setOpen: (open: boolean) => void,
) => {
  const { t } = useTranslation();
  const { isEmpty } = validate();
  const { data: currencyRules } = useCurrencyRules();

  const { mutateAsync: createProduct, isPending: isLoading } =
    useCreateGymPassProduct();

  const initialData: CreateGymPassProductFormData = {
    name: "",
    description: "",
    passType: "SingleUse",
    totalUses: 1,
    daysAfterExpires: undefined,
    isActive: true,
    price: {
      amount: 0,
      currency: "HUF",
    },
  };

  const { data, setData, handleChange, setNestedValue } =
    useFormState<CreateGymPassProductFormData>(initialData);
  const [errors, setErrors] = useState<CreateGymPassProductFormErrors>({});

  const handleMoneyChange = useCallback(
    <K extends keyof Money>(field: K, value: Money[K]) => {
      setNestedValue("price", field, value);
    },
    [setNestedValue],
  );

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
  }, []);

  const isUnlimited = data.passType === "Unlimited";

  const validateForm = (): boolean => {
    const newErrors: CreateGymPassProductFormErrors = {};

    if (isEmpty(data.name)) {
      newErrors.name = " ";
    }

    if (isEmpty(data.description)) {
      newErrors.description = " ";
    }

    if (isUnlimited && data.daysAfterExpires! < 1) {
      newErrors.daysAfterExpires = t("PassMustExpireAfterAtLeastOneDay");
    }

    if (data.passType === "MultiUse" && data.totalUses! < 2) {
      newErrors.totalUses = t("MultiUsePassMustHaveAtLeastTwoTotalUses");
    }

    if (data.passType === "SingleUse" && data.totalUses !== 1) {
      newErrors.totalUses = t("SingleUsePassCanOnlyHaveOneUse");
    }

    const { errors: moneyErrors, hasErrors } = validateMoney(
      data.price,
      t,
      currencyRules!,
    );

    if (hasErrors) {
      newErrors.price = moneyErrors;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const command: CreateGymPassProductCommand = {
      name: data.name.trim(),
      description: data.description.trim(),
      passType: data.passType,
      daysAfterExpires: isUnlimited ? data.daysAfterExpires : undefined,
      totalUses: isUnlimited ? undefined : data.totalUses,
      price: data.price,
      isActive: data.isActive,
    };

    try {
      await createProduct(command);

      setOpen(false);
      reset();
    } catch {}
  };

  return {
    data,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    reset,
    handleMoneyChange,
  };
};
