import { FormEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Address, CreateGymContactInfoCommand } from "@api/types";
import { useCreateGymContactInfo } from "@hooks/gymContactInfos/useGymContactInfos.ts";
import { validate } from "@lib/validationUtils.ts";
import { emptyAddress, isAddressEmpty } from "@lib/addressUtils.ts";
import { useCountryAlpha2Codes } from "@hooks/referenceData/useReferenceData.ts";
import {
  GymContactInfoFormData,
  GymContactInfoFormErrors,
  validateGymContactInfoFormData,
} from "@lib/gymContactInfoUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";

export const useCreateGymContactInfoForm = (
  setOpen: (open: boolean) => void,
) => {
  const { t } = useTranslation();
  const { data: countryCodes } = useCountryAlpha2Codes();
  const { mutateAsync: createContactInfo, isPending: isLoading } =
    useCreateGymContactInfo();
  const { isEmpty } = validate();

  const initialData = useMemo<GymContactInfoFormData>(
    () => ({
      fullName: "",
      email: "",
      phoneNumber: "",
      address: emptyAddress,
    }),
    [],
  );

  const { data, handleChange, setNestedValue, setData } =
    useFormState<GymContactInfoFormData>(initialData);

  const [errors, setErrors] = useState<GymContactInfoFormErrors>({});

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { errors: newErrors, hasErrors } = validateGymContactInfoFormData(
      data,
      t,
      countryCodes ?? ["HU"],
    );

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const command: CreateGymContactInfoCommand = {
      fullName: data.fullName.trim(),
      email: data.email.trim() || undefined,
      phoneNumber: isEmpty(data.phoneNumber)
        ? undefined
        : data.phoneNumber.trim(),
      address: isAddressEmpty(data.address) ? undefined : data.address,
    };

    await createContactInfo(command);
    setOpen(false);
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
