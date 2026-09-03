import { LoginFormData } from "./useLoginForm.ts";
import { useTranslation } from "react-i18next";
import { validate } from "@lib/validationUtils.ts";
import { useAuth } from "@hooks/user/useAuth.ts";
import { FormEvent, useState } from "react";
import { languageMap } from "@constants/languages.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { RegisterUserCommand } from "@api/types.ts";

interface RegisterFormData extends LoginFormData {
  firstName: string;
  lastName: string;
  passwordConfirm: string;
  asPendingGymEmployee: boolean;
  preferredLanguage: string;
}

type RegisterFormErrors = FormErrors<RegisterFormData>;

export const useRegisterForm = () => {
  const { t } = useTranslation();
  const { isEmailValid, isPasswordValid, isEmpty } = validate();
  const { register, isLoading } = useAuth();

  const initialData: RegisterFormData = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    passwordConfirm: "",
    preferredLanguage: languageMap.en,
    asPendingGymEmployee: false,
  };

  const { data, handleChange } = useFormState<RegisterFormData>(initialData);

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const clearErrors = () => {
    setErrors({});
  };

  const validateRegister = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (isEmpty(data.firstName)) {
      newErrors.firstName = " ";
    }

    if (isEmpty(data.lastName)) {
      newErrors.lastName = " ";
    }

    if (isEmpty(data.email)) {
      newErrors.email = " ";
    } else if (!isEmailValid(data.email)) {
      newErrors.email = t("InvalidValue", { value: t("EmailAddress") });
    }

    if (isEmpty(data.password)) {
      newErrors.password = " ";
    } else if (!isPasswordValid(data.password)) {
      newErrors.password = t("PasswordRules");
    }

    if (isEmpty(data.passwordConfirm)) {
      newErrors.passwordConfirm = " ";
    } else if (data.password !== data.passwordConfirm) {
      newErrors.passwordConfirm = t("PasswordsMustMatch");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateRegister()) return;

    const command: RegisterUserCommand = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      preferredLanguage: data.preferredLanguage,
      asPendingGymEmployee: data.asPendingGymEmployee,
    };

    try {
      await register.mutateAsync(command);
    } catch {}
  };

  return {
    data,
    errors,
    clearErrors,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
