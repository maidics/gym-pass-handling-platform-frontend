import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSendPasswordResetEmail } from "@hooks/user/useUpdateUser.ts";
import { validate } from "@lib/validationUtils.ts";

export const useSendPasswordResetEmailForm = () => {
  const { t } = useTranslation();
  const { isEmailValid, isEmpty } = validate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const { mutateAsync, isPending: isLoading } = useSendPasswordResetEmail();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(undefined);
  };

  const validateForm = () => {
    if (isEmpty(email)) {
      setError(" ");
      return false;
    }

    if (!isEmailValid(email)) {
      setError(t("InvalidValue", { value: t("EmailAddress") }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await mutateAsync(email.trim());
    } catch {}
  };

  return { email, error, handleChange, handleSubmit, isLoading };
};
