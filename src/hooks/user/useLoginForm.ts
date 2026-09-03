import { useState, FormEvent } from "react";
import { useAuth } from "./useAuth.ts";
import { useTranslation } from "react-i18next";
import { validate } from "@lib/validationUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { LogInUserCommand } from "@api/types.ts";
import { FormErrors } from "@lib/formUtils.ts";

export interface LoginFormData {
  email: string;
  password: string;
}

type LoginFormErrors = FormErrors<LoginFormData>;

export const useLoginForm = () => {
  const { t } = useTranslation();
  const { isEmailValid, isEmpty } = validate();
  const { login, isLoading } = useAuth();

  const initialData: LoginFormData = {
    email: "",
    password: "",
  };

  const { data, handleChange } = useFormState<LoginFormData>(initialData);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (isEmpty(data.email)) {
      newErrors.email = " ";
    } else if (!isEmailValid(data.email)) {
      newErrors.email = t("InvalidValue", { value: t("EmailAddress") });
    }

    if (isEmpty(data.password)) {
      newErrors.password = " ";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const command: LogInUserCommand = {
      email: data.email,
      password: data.password,
    };

    try {
      await login.mutateAsync(command);
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
