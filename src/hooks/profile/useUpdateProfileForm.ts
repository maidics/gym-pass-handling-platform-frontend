import { useState } from "react";
import { useUpdateMyProfile } from "./useUpdateProfile.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { validate } from "@lib/validationUtils.ts";
import { useAuth } from "@hooks/user/useAuth.ts";

interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  preferredLanguage: string;
}

type UpdateProfileFormErrors = FormErrors<UpdateProfileFormData>;

export const useUpdateProfileForm = (setOpen: (open: boolean) => void) => {
  const { user } = useAuth();
  const { isEmpty } = validate();

  const { mutateAsync: updateMyProfile, isPending: isLoading } =
    useUpdateMyProfile();

  const initialData: UpdateProfileFormData = {
    firstName: user!.firstName,
    lastName: user!.lastName,
    preferredLanguage: user!.preferredLanguage,
  };

  const { data, handleChange } =
    useFormState<UpdateProfileFormData>(initialData);

  const [errors, setErrors] = useState<UpdateProfileFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: UpdateProfileFormErrors = {};

    if (isEmpty(data.firstName)) {
      newErrors.firstName = " ";
    }

    if (isEmpty(data.lastName)) {
      newErrors.lastName = " ";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateMyProfile(data);

      setOpen(false);
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
