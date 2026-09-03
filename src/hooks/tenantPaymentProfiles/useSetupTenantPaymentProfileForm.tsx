import { FormEvent, useEffect, useState } from "react";
import {
  CreateTenantPaymentProfileCommand,
  PaymentProviderLinkDto,
} from "@api/types.ts";
import { useCreateTenantPaymentProfile } from "./useTenantPaymentProfile";
import { useTranslation } from "react-i18next";
import { validate } from "@lib/validationUtils.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";

interface SetupTenantPaymentProfileFormData {
  paymentAccountHolderEmail: string;
  businessName: string;
}

type SetupTenantPaymentProfileFormErrors =
  FormErrors<SetupTenantPaymentProfileFormData>;

export const useSetupTenantPaymentProfileForm = () => {
  const { isEmailValid, isEmpty } = validate();
  const { t } = useTranslation();

  const initialData: SetupTenantPaymentProfileFormData = {
    businessName: "",
    paymentAccountHolderEmail: "",
  };

  const { data, handleChange } =
    useFormState<SetupTenantPaymentProfileFormData>(initialData);

  const [errors, setErrors] = useState<SetupTenantPaymentProfileFormErrors>({});
  const [paymentProviderLink, setPaymentProviderLink] =
    useState<PaymentProviderLinkDto | null>(null);

  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
    null,
  );

  const { mutateAsync: setupPaymentProfile, isPending } =
    useCreateTenantPaymentProfile();

  const validateForm = (): boolean => {
    const newErrors: SetupTenantPaymentProfileFormErrors = {};

    if (isEmpty(data.paymentAccountHolderEmail)) {
      newErrors.paymentAccountHolderEmail = " ";
    } else if (!isEmailValid(data.paymentAccountHolderEmail)) {
      newErrors.paymentAccountHolderEmail = t("InvalidValue", {
        value: t("EmailAddress"),
      });
    }

    if (isEmpty(data.paymentAccountHolderEmail)) {
      newErrors.businessName = " ";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) return;

    const command: CreateTenantPaymentProfileCommand = {
      businessName: data.businessName,
      paymentAccountHolderEmail: data.paymentAccountHolderEmail,
    };

    try {
      const result = await setupPaymentProfile(command);

      setPaymentProviderLink(result);
      setRedirectCountdown(5);
    } catch {}
  };

  useEffect(() => {
    if (!paymentProviderLink || redirectCountdown === null) return;

    if (redirectCountdown <= 0) {
      window.location.href = paymentProviderLink.url;
      return;
    }

    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearTimeout(timer);
  }, [paymentProviderLink, redirectCountdown]);

  return {
    data,
    handleChange,
    errors,
    handleSubmit,
    isLoading: isPending,
    paymentProviderLink,
    redirectCountdown,
  };
};
