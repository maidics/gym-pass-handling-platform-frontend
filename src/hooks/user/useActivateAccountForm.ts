import { useTranslation } from "react-i18next";
import { validate } from "@lib/validationUtils.ts";
import { useAuth } from "@hooks/user/useAuth.ts";
import { FormEvent, useState } from "react";
import { FormErrors } from "@lib/formUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { ActivateUserAccountCommand } from "@api/types.ts";

interface ActivateAccountFormData {
  password?: string;
  passwordConfirm?: string;
}

type ActivateAccountFormErrors = FormErrors<ActivateAccountFormData>;

export const useActivateAccountForm = (
  encodedEmail: string,
  encodedEmailConfirmationToken: string,
  setPassword: boolean,
) => {
  const { t } = useTranslation();
  const { isPasswordValid, isEmpty } = validate();
  const { activateAccount, isLoading, isSuccess } = useAuth();

  const initialData: ActivateAccountFormData = {
    password: "",
    passwordConfirm: "",
  };

  const { data, handleChange } =
    useFormState<ActivateAccountFormData>(initialData);

  const [errors, setErrors] = useState<ActivateAccountFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ActivateAccountFormErrors = {};

    if (!setPassword) return true;

    if (isEmpty(data.password)) {
      newErrors.password = " ";
    }

    if (!isPasswordValid(data.password)) {
      newErrors.password = t("PasswordRules");
    }

    if (!data.passwordConfirm) {
      newErrors.passwordConfirm = " ";
    }

    if (data.password !== data.passwordConfirm) {
      newErrors.password = " ";
      newErrors.passwordConfirm = t("PasswordsMustMatch");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const command: ActivateUserAccountCommand = {
      encodedEmail,
      encodedEmailConfirmationToken,
      setPassword,
      password: setPassword ? data.password : undefined,
      passwordConfirm: setPassword ? data.passwordConfirm : undefined,
    };

    try {
      await activateAccount(command);
    } catch {}
  };

  return {
    data,
    errors,
    isLoading,
    isSuccess,
    handleChange,
    handleSubmit,
  };
};
