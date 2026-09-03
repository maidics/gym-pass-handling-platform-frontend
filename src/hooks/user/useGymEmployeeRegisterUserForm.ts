import { FormErrors } from "@lib/formUtils.ts";
import { validate } from "@lib/validationUtils.ts";
import { useTranslation } from "react-i18next";
import { useFormState } from "@hooks/utils/useForms.ts";
import { useState } from "react";
import { GymEmployeeRegisterUserCommand } from "@api/types.ts";
import { useGymEmployeeRegisterUser } from "@hooks/user/useGymEmployeeRegisterUser.ts";

interface GymEmployeeRegisterUserFormData {
  email: string;
  firstName: string;
  lastName: string;
}

type GymEmployeeRegisterUserFormErrors =
  FormErrors<GymEmployeeRegisterUserFormData>;

export const useGymEmployeeRegisterUserForm = (
  setOpen: (open: boolean) => void,
) => {
  const { isEmpty, isEmailValid } = validate();
  const { t } = useTranslation();

  const { mutateAsync: registerUser, isPending: isLoading } =
    useGymEmployeeRegisterUser();

  const initialData: GymEmployeeRegisterUserFormData = {
    email: "",
    firstName: "",
    lastName: "",
  };

  const { data, setData, handleChange } =
    useFormState<GymEmployeeRegisterUserFormData>(initialData);
  const [errors, setErrors] = useState<GymEmployeeRegisterUserFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: GymEmployeeRegisterUserFormErrors = {};

    if (isEmpty(data.email)) {
      newErrors.email = " ";
    } else if (!isEmailValid(data.email)) {
      newErrors.email = t("InvalidValue", { value: t("EmailAddress") });
    }

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

    if (!validateForm()) {
      return;
    }

    const command: GymEmployeeRegisterUserCommand = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    try {
      await registerUser(command);

      reset();
      setOpen(false);
    } catch {}
  };

  const reset = () => {
    setData(initialData);
    setErrors({});
  };

  return {
    data,
    handleSubmit,
    handleChange,
    errors,
    isLoading,
    reset,
  };
};
