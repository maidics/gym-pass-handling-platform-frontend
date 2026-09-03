import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@hooks/user/useAuth";
import type { ResetPasswordCommand } from "@api/types.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { validate } from "@lib/validationUtils.ts";

type ResetPasswordFormData = {
  newPassword: string;
  newPasswordConfirm: string;
};

type ResetPasswordFormErrors = FormErrors<ResetPasswordFormData>;

export const useResetPasswordForm = (
  encodedUserId: string,
  encodedPasswordResetToken: string,
) => {
  const { t } = useTranslation();
  const { isEmpty, isPasswordValid } = validate();

  const { resetPassword, isLoading, isSuccess } = useAuth();

  const initialData: ResetPasswordFormData = {
    newPassword: "",
    newPasswordConfirm: "",
  };

  const { data, handleChange } =
    useFormState<ResetPasswordFormData>(initialData);

  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});

  const isUrlValid = useMemo(
    () => !!encodedUserId && !!encodedPasswordResetToken,
    [encodedUserId, encodedPasswordResetToken],
  );

  const validateForm = () => {
    const newErrors: ResetPasswordFormErrors = {};

    if (isEmpty(data.newPassword)) {
      newErrors.newPassword = " ";
    }

    if (!isPasswordValid(data.newPassword)) {
      newErrors.newPassword = t("PasswordRules");
    }

    if (isEmpty(data.newPasswordConfirm)) {
      newErrors.newPasswordConfirm = " ";
    }

    if (data.newPassword !== data.newPasswordConfirm) {
      newErrors.newPassword = " ";
      newErrors.newPasswordConfirm = t("PasswordsMustMatch");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUrlValid) return;
    if (!validateForm()) return;

    const command: ResetPasswordCommand = {
      encodedUserId,
      encodedPasswordResetToken,
      newPassword: data.newPassword,
      newPasswordConfirm: data.newPasswordConfirm,
    };

    try {
      await resetPassword(command);
    } finally {
    }
  };

  return {
    data,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    isSuccess,
    isUrlValid,
  };
};
