import { FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateGymAdminPromotionRequest,
  useCreateGymCreationRequest,
  useCreatePayloadFreeRequest,
} from "./useCreateRequests";
import {
  Address,
  GymStatus,
  GymTier,
  PriorityLevel,
  RequestType,
} from "@api/types.ts";
import { validate } from "@lib/validationUtils.ts";
import {
  AddressFormErrors,
  emptyAddress,
  validateAddress,
} from "@lib/addressUtils.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { useFormState } from "@hooks/utils/useForms.ts";
import { useCountryAlpha2Codes } from "@hooks/referenceData/useReferenceData.ts";
import { useAuth } from "@hooks/user/useAuth.ts";

interface CreateRequestFormData {
  //default required
  title: string;
  description: string;
  priorityLevel: PriorityLevel;

  //comes from the component itself - not input
  requestType: RequestType;

  //optional: depends on type

  //gym creation
  //createGymDto?: CreateGymDto;

  gymAddress?: Address;
  gymName?: string;
  gymStatus?: GymStatus;
  gymTier?: GymTier;
  gymSupervisorEmail?: string;

  //gym admin promotion
  promotionPendingGymEmployeeEmail?: string;
  promotionSuperVisorEmail?: string;

  useMyEmailAsSuperVisor?: boolean;
}

type CreateRequestFormErrors = Omit<
  FormErrors<CreateRequestFormData>,
  "priorityLevel" | "requestType" | "gymAddress"
> & {
  gymAddress?: AddressFormErrors;
};

export const useCreateRequestForm = (setOpen: (open: boolean) => void) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isEmailValid, isEmpty } = validate();
  const { data: countryCodes } = useCountryAlpha2Codes();

  const { mutate: createGymCreation, isPending: isCreatingGym } =
    useCreateGymCreationRequest();
  const { mutate: createGymAdminPromotion, isPending: isCreatingPromo } =
    useCreateGymAdminPromotionRequest();
  const { mutate: createPayloadFree, isPending: isCreatingPayload } =
    useCreatePayloadFreeRequest();

  const initialData: CreateRequestFormData = {
    title: "",
    description: "",
    priorityLevel: "Medium",
    requestType: "Other",
    gymAddress: emptyAddress,
    gymName: "",
    gymStatus: "Active",
    gymTier: "Local",
    gymSupervisorEmail: "",
    promotionPendingGymEmployeeEmail: "",
    promotionSuperVisorEmail: "",
    useMyEmailAsSuperVisor: false,
  };

  const { data, setData, handleChange, setNestedValue } =
    useFormState<CreateRequestFormData>(initialData);
  const [errors, setErrors] = useState<CreateRequestFormErrors>({});

  const handleGymCreationAddressChange = useCallback(
    <K extends keyof Address>(field: K, value: Address[K]) => {
      setNestedValue("gymAddress", field, value);
    },
    [setNestedValue],
  );

  const handleUseMyEmailAsSuperVisorChange = (
    state: boolean,
    field: keyof CreateRequestFormData,
  ) => {
    handleChange("useMyEmailAsSuperVisor", state);

    if (state) {
      handleChange(field, user!.email!);
    } else {
      handleChange(field, "");
    }
  };

  const isLoading = isCreatingGym || isCreatingPromo || isCreatingPayload;

  const validateForm = (): boolean => {
    const newErrors: CreateRequestFormErrors = {};

    const invalidEmailMessage = t("InvalidValue", { value: t("EmailAddress") });

    if (isEmpty(data.title)) {
      newErrors.title = " ";
    }

    if (isEmpty(data.description)) {
      newErrors.description = " ";
    }

    if (isEmpty(data.priorityLevel)) {
      throw new Error(`Form error: request priority level is missing.`);
    }

    if (isEmpty(data.requestType)) {
      throw new Error(`Form error: request type is missing.`);
    }

    if (data.requestType === "GymCreation") {
      if (!data.gymAddress)
        throw new Error(
          `Form error: address is missing for gym creation request.`,
        );
      if (!data.gymName)
        throw new Error(
          `Form error: gym name is missing for gym creation request.`,
        );
      if (!data.gymStatus)
        throw new Error(
          `Form error: gym status is missing for gym creation request.`,
        );
      if (!data.gymTier)
        throw new Error(
          `Form error: gym tier is missing for gym creation request.`,
        );
      if (!data.gymSupervisorEmail)
        throw new Error(
          `Form error: gym supervisor email is missing for gym creation request.`,
        );

      const { errors: addressErrors, hasErrors: hasAddressErrors } =
        validateAddress(data.gymAddress, t, countryCodes!);

      if (hasAddressErrors) {
        newErrors.gymAddress = addressErrors;
      }

      if (isEmpty(data.gymName)) {
        newErrors.gymName = " ";
      }

      if (isEmpty(data.gymSupervisorEmail)) {
        newErrors.gymSupervisorEmail = " ";
      } else if (!isEmailValid(data.gymSupervisorEmail)) {
        newErrors.gymSupervisorEmail = invalidEmailMessage;
      }
    }

    if (data.requestType === "GymAdminPromotion") {
      if (!data.promotionPendingGymEmployeeEmail)
        throw new Error(
          `Form error: pending gym employee email is missing for gym admin promotion request.`,
        );
      if (!data.promotionSuperVisorEmail)
        throw new Error(
          `Form error: supervisor email is missing for gym admin promotion request.`,
        );

      if (isEmpty(data.promotionPendingGymEmployeeEmail)) {
        newErrors.promotionPendingGymEmployeeEmail = " ";
      } else if (!isEmailValid(data.promotionPendingGymEmployeeEmail)) {
        newErrors.promotionPendingGymEmployeeEmail = invalidEmailMessage;
      }

      if (isEmpty(data.promotionSuperVisorEmail)) {
        newErrors.promotionSuperVisorEmail = " ";
      } else if (!isEmailValid(data.promotionSuperVisorEmail)) {
        newErrors.promotionSuperVisorEmail = invalidEmailMessage;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) return;

    const handleSuccess = () => {
      setOpen(false);
      setData(initialData);
    };

    const baseCommand = {
      title: data.title,
      description: data.description,
      priorityLevel: data.priorityLevel,
    };

    switch (data.requestType) {
      case "GymCreation":
        createGymCreation(
          {
            ...baseCommand,
            createGymDto: {
              name: data.gymName!,
              supervisorEmail: data.useMyEmailAsSuperVisor
                ? user!.email!
                : data.gymSupervisorEmail!,
              tier: data.gymTier!,
              status: data.gymStatus!,
              address: data.gymAddress!,
            },
          },
          { onSuccess: handleSuccess },
        );
        break;

      case "GymAdminPromotion":
        createGymAdminPromotion(
          {
            ...baseCommand,
            pendingGymEmployeeEmail: data.promotionPendingGymEmployeeEmail!,
            supervisorEmail: data.useMyEmailAsSuperVisor
              ? user!.email!
              : data.promotionSuperVisorEmail!,
          },
          { onSuccess: handleSuccess },
        );
        break;

      case "Other":
        createPayloadFree(
          {
            ...baseCommand,
            requestType: data.requestType,
          },
          { onSuccess: handleSuccess },
        );
        break;
    }
  };

  return {
    data,
    errors,
    handleChange,
    isLoading,
    handleGymCreationAddressChange,
    handleSubmit,
    handleUseMyEmailAsSuperVisorChange,
  };
};
