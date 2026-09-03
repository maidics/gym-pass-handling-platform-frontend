import { useTranslation } from "react-i18next";
import { validate } from "@lib/validationUtils.ts";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSendAccountActivationEmail } from "@hooks/user/useUpdateUser.ts";

export const useRequestAccountActivationEmailForm = () => {
  const { t } = useTranslation();
  const { isEmailValid } = validate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutate: sendActivationEmail, isPending: isLoading } =
    useSendAccountActivationEmail();

  const validateForm = () => {
    let newError: string = "";
    if (!email) newError = " ";
    else if (!isEmailValid(email))
      newError = t("InvalidValue", { value: t("EmailAddress") });
    setError(newError);
    return newError === "";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    sendActivationEmail(email);
  };

  return {
    email,
    error,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
