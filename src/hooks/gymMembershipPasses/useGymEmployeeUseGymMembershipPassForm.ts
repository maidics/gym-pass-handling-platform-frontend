import { validate } from "@lib/validationUtils.ts";
import { useGymEmployeeUseGymMembershipPass } from "@hooks/gymMembershipPasses/useGymMembershipPasses.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { FormEvent, useState } from "react";

interface GymEmployeeUseGymMembershipPassFormProps {
  setOpen: (open: boolean) => void;
  gymMembershipPassId?: string;
  userId?: string;
}

interface GymEmployeeUseGymMembershipPassForm {
  lockerNumber: string;
}

type GymEmployeeUseGymMembershipPassFromErrors =
  FormErrors<GymEmployeeUseGymMembershipPassForm>;

export const useGymEmployeeUseGymMembershipPassForm = ({
  gymMembershipPassId,
  userId,
  setOpen,
}: GymEmployeeUseGymMembershipPassFormProps) => {
  const { isEmpty } = validate();

  const { mutateAsync: usePass, isPending } =
    useGymEmployeeUseGymMembershipPass();

  const initialData: GymEmployeeUseGymMembershipPassForm = {
    lockerNumber: "",
  };

  const { data, handleChange } = useFormState(initialData);
  const [errors, setErrors] =
    useState<GymEmployeeUseGymMembershipPassFromErrors>({});

  const validateForm = () => {
    const newErrors: GymEmployeeUseGymMembershipPassFromErrors = {};

    if (isEmpty(data.lockerNumber)) {
      newErrors.lockerNumber = " ";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isEmpty(gymMembershipPassId)) {
      throw new Error("Missing pass id.");
    }

    if (isEmpty(userId)) {
      throw new Error("Missing user id.");
    }

    if (!validateForm()) return;

    await usePass({
      gymMembershipPassId: gymMembershipPassId!,
      userId: userId!,
      lockerNumber: data.lockerNumber,
    });

    setOpen(false);
  };

  return {
    data,
    errors,
    setErrors,
    isLoading: isPending,
    onSubmit,
    handleChange,
  };
};
