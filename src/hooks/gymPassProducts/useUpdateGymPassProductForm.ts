import { useUpdateGymPassProduct } from "@hooks/gymPassProducts/useUpdateGymPassProduct.ts";
import {
  GymPassProductDto,
  Money,
  UpdateGymPassProductCommand,
} from "@api/types.ts";
import { useCurrencyRules } from "@hooks/referenceData/useReferenceData.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { FormEvent, useCallback, useState } from "react";
import { validate } from "@lib/validationUtils.ts";
import { MoneyFormErrors, validateMoney } from "@lib/moneyUtils.ts";
import { useTranslation } from "react-i18next";

interface UpdateGymPassProductFormProps {
  name: string;
  description: string;
  price: Money;
  totalUses?: number;
  daysAfterExpires?: number;
}

type UpdateGymPassProductFormErrors = Omit<
  FormErrors<UpdateGymPassProductFormProps>,
  "price"
> & { price?: MoneyFormErrors };

export const useUpdateGymPassProductForm = (
  gymPassProduct: GymPassProductDto,
  setOpen: (open: boolean) => void,
) => {
  const { t } = useTranslation();
  const { isEmpty } = validate();

  const { mutateAsync: updateProduct, isPending } = useUpdateGymPassProduct();
  const { data: currencyRules } = useCurrencyRules();

  const initialData: UpdateGymPassProductFormProps = {
    name: gymPassProduct.name,
    description: gymPassProduct.description,
    price: gymPassProduct.price,
    totalUses: gymPassProduct.totalUses,
    daysAfterExpires: gymPassProduct.daysAfterExpiring,
  };

  const { data, setNestedValue, handleChange } =
    useFormState<UpdateGymPassProductFormProps>(initialData);

  const [errors, setErrors] = useState<UpdateGymPassProductFormErrors>({});

  const handleMoneyChange = useCallback(
    <K extends keyof Money>(field: K, value: Money[K]) => {
      setNestedValue("price", field, value);
    },
    [setNestedValue],
  );

  const validateForm = () => {
    const newErrors: UpdateGymPassProductFormErrors = {};

    if (isEmpty(data.name)) {
      newErrors.name = " ";
    }

    if (isEmpty(data.description)) {
      newErrors.description = " ";
    }

    const { errors: moneyErrors, hasErrors } = validateMoney(
      data.price,
      t,
      currencyRules!,
    );

    if (hasErrors) {
      newErrors.price = moneyErrors;
    }

    if (gymPassProduct.type === "Unlimited" && data.daysAfterExpires! < 1) {
      newErrors.daysAfterExpires = t("PassMustExpireAfterAtLeastOneDay");
    }

    if (gymPassProduct.type === "MultiUse" && data.totalUses! < 2) {
      newErrors.totalUses = t("MultiUsePassMustHaveAtLeastTwoTotalUses");
    }

    if (gymPassProduct.type === "SingleUse" && data.totalUses !== 1) {
      newErrors.totalUses = t("SingleUsePassCanOnlyHaveOneUse");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: UpdateGymPassProductCommand = {
      gymPassProductId: gymPassProduct.id,
      type: gymPassProduct.type,
      name: data.name.trim(),
      description: data.description.trim(),
      totalUses: data.totalUses,
      daysAfterExpiring: data.daysAfterExpires,
      price: {
        amount: data.price.amount,
        currency: data.price.currency,
      },
    };

    await updateProduct(payload);

    setOpen(false);
  };

  return {
    data,
    errors,
    isLoading: isPending,
    onSubmit,
    handleMoneyChange,
    handleChange,
  };
};
