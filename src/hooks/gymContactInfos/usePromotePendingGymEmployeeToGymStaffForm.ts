import { validate } from "@lib/validationUtils";
import { useTranslation } from "react-i18next";
import { FormEvent, useState } from "react";
import { usePromotePendingGymEmployeeToGymStaff } from "@hooks/user/useUpdateUser.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";

interface PromotePendingGymEmployeeToGymStaffData {
  pendingGymEmployeeEmail: string;
}

type PromotePendingGymEmployeeToGymStaffErrors =
  FormErrors<PromotePendingGymEmployeeToGymStaffData>;

export const usePromotePendingGymEmployeeToGymStaffForm = (
  setOpen: (open: boolean) => void,
) => {
  const { isEmpty, isEmailValid } = validate();
  const { t } = useTranslation();

  const initialData: PromotePendingGymEmployeeToGymStaffData = {
    pendingGymEmployeeEmail: "",
  };

  const { data, setData, handleChange } =
    useFormState<PromotePendingGymEmployeeToGymStaffData>(initialData);

  const [errors, setErrors] =
    useState<PromotePendingGymEmployeeToGymStaffErrors>({});

  const { mutateAsync: promote, isPending: isLoading } =
    usePromotePendingGymEmployeeToGymStaff();

  const validateForm = (): boolean => {
    const newErrors: PromotePendingGymEmployeeToGymStaffErrors = {};

    if (isEmpty(data.pendingGymEmployeeEmail)) {
      newErrors.pendingGymEmployeeEmail = " ";
    } else if (!isEmailValid(data.pendingGymEmployeeEmail)) {
      newErrors.pendingGymEmployeeEmail = t("InvalidValue", {
        value: t("EmailAddress"),
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) return;

    try {
      await promote({
        pendingGymEmployeeEmail: data.pendingGymEmployeeEmail,
      });

      reset();
      setOpen(false);
    } catch (err) {}
  };

  const reset = () => {
    setData(initialData);
    setErrors({});
  };

  return {
    data,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    reset,
  };
};
