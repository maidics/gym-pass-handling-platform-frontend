import { useState } from "react";
import { useUpdateMyPassword } from "./useUpdateUser.ts";
import { useTranslation } from "react-i18next";
import { validate } from "@lib/validationUtils.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { UpdateMyPasswordCommand } from "@api/types.ts";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

type PasswordFormErrors = FormErrors<PasswordFormData>;

export const useUpdateMyPasswordForm = (setOpen: (open: boolean) => void) => {
  const { isPasswordValid, isEmpty } = validate();
  const { t } = useTranslation();

  const initialData: PasswordFormData = {
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  };

  const { data, setData, handleChange } =
    useFormState<PasswordFormData>(initialData);

  const [errors, setErrors] = useState<PasswordFormErrors>({});

  const { mutateAsync: updateMyPassword, isPending: isLoading } =
    useUpdateMyPassword();

  const validateForm = (): boolean => {
    const newErrors: PasswordFormErrors = {};

    if (isEmpty(data.currentPassword)) {
      newErrors.currentPassword = " ";
    }

    if (data.currentPassword === data.newPassword) {
      newErrors.newPassword = t("NewPasswordSameAsCurrent");
    } else if (!isPasswordValid(data.newPassword)) {
      newErrors.newPassword = t("PasswordRules");
    }

    if (data.newPassword !== data.newPasswordConfirm) {
      newErrors.newPasswordConfirm = t("PasswordsMustMatch");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setData(initialData);
    setErrors({});
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const command: UpdateMyPasswordCommand = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        newPasswordConfirm: data.newPasswordConfirm,
      };

      await updateMyPassword(command);

      reset();
    } catch {}
  };

  return {
    data,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
