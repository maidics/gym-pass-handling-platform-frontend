import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  Address,
  GymContactInfoDto,
  UpdateGymContactInfoCommand,
} from "@api/types.ts";
import { useUpdateGymContactInfo } from "@hooks/gymContactInfos/useGymContactInfos.ts";
import {
  GymContactInfoFormData,
  GymContactInfoFormErrors,
  validateGymContactInfoFormData,
} from "@lib/gymContactInfoUtils.ts";
import { emptyAddress, isAddressEmpty } from "@lib/addressUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { useCountryAlpha2Codes } from "@hooks/referenceData/useReferenceData.ts";
import { validate } from "@lib/validationUtils.ts";

export const useUpdateGymContactInfoForm = (
  contact: GymContactInfoDto,
  setOpen: (open: boolean) => void,
) => {
  const { t } = useTranslation();
  const { data: countryCodes } = useCountryAlpha2Codes();
  const { isEmpty } = validate();

  const { mutateAsync: updateContactInfo, isPending: isLoading } =
    useUpdateGymContactInfo();

  const initialData = useMemo<GymContactInfoFormData>(
    () => ({
      fullName: contact.fullName ?? "",
      email: contact.email ?? "",
      phoneNumber: contact.phoneNumber?.value ?? "",
      address: contact.address ?? emptyAddress,
    }),
    [contact],
  );

  const { data, setData, handleChange, setNestedValue } =
    useFormState<GymContactInfoFormData>(initialData);
  const [errors, setErrors] = useState<GymContactInfoFormErrors>({});

  useEffect(() => {
    setData(initialData);
    setErrors({});
  }, [initialData, setData]);

  const resetForm = useCallback(() => {
    setData(initialData);
    setErrors({});
  }, [initialData, setData]);

  const handleAddressChange = useCallback(
    <K extends keyof Address>(field: K, value: Address[K]) => {
      setNestedValue("address", field, value);
    },
    [setNestedValue],
  );

  const { errors: newErrors, hasErrors } = validateGymContactInfoFormData(
    data,
    t,
    countryCodes ?? ["HU"],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const command: UpdateGymContactInfoCommand = {
      gymContactInfoId: contact.id,
      fullName: data.fullName.trim(),
      email: data.email.trim() || undefined,
      phoneNumber: isEmpty(data.phoneNumber)
        ? undefined
        : data.phoneNumber.trim(),
      address: isAddressEmpty(data.address) ? undefined : data.address,
    };

    try {
      await updateContactInfo(command);
      setOpen(false);
      resetForm();
    } catch {}
  };

  return {
    data,
    errors,
    isLoading,
    handleChange,
    handleAddressChange,
    handleSubmit,
    resetForm,
  };
};
