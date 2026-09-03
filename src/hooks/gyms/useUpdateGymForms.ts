import { useState, useMemo, useEffect, useCallback, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateMyGymProfile } from "./useUpdateGyms.ts";
import {
  Address,
  GymDto,
  GymTier,
  UpdateMyGymProfileCommand,
} from "@api/types.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { AddressFormErrors, validateAddress } from "@lib/addressUtils.ts";
import { useCountryAlpha2Codes } from "@hooks/referenceData/useReferenceData.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { validate } from "@lib/validationUtils.ts";

interface GymProfileFormData {
  name: string;
  address: Address;
  tier: GymTier;
}

type GymProfileFormErrors = Omit<FormErrors<GymProfileFormData>, "address"> & {
  address?: AddressFormErrors;
};

export const useEditGymProfileForm = (
  gym: GymDto,
  setOpen: (open: boolean) => void,
) => {
  const { t } = useTranslation();
  const { isEmpty } = validate();
  const { data: countryCodes = ["HU"] } = useCountryAlpha2Codes();

  const { mutateAsync: updateGymProfile, isPending } = useUpdateMyGymProfile();

  const initialData: GymProfileFormData = useMemo(
    () => ({
      name: gym.name,
      address: gym.address,
      tier: gym.tier,
    }),
    [gym],
  );

  const { data, handleChange, setData, setNestedValue } =
    useFormState<GymProfileFormData>(initialData);
  const [errors, setErrors] = useState<GymProfileFormErrors>({});

  useEffect(() => {
    setData(initialData);
    setErrors({});
  }, [initialData, setOpen]);

  const handleAddressChange = useCallback(
    <K extends keyof Address>(field: K, value: Address[K]) => {
      setNestedValue("address", field, value);
    },
    [setNestedValue],
  );

  const validateForm = (): boolean => {
    const newErrors: GymProfileFormErrors = {};

    if (isEmpty(data.name)) newErrors.name = " ";

    const { errors: addressErrors, hasErrors } = validateAddress(
      data.address,
      t,
      countryCodes,
    );

    if (hasErrors) {
      newErrors.address = addressErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const command: UpdateMyGymProfileCommand = {
      newTier: data.tier,
      newAddress: data.address,
      newName: data.name,
    };

    try {
      await updateGymProfile(command);
      setOpen(false);
    } catch (error) {}
  };

  return {
    data,
    errors,
    isLoading: isPending,
    handleChange,
    handleAddressChange,
    handleSubmit,
  };
};
