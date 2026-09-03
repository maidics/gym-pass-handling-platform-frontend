import { Address } from "@api/types.ts";
import { FormErrors } from "@lib/formUtils.ts";
import {
  AddressFormErrors,
  isAddressEmpty,
  validateAddress,
} from "@lib/addressUtils.ts";
import { validate } from "@lib/validationUtils.ts";
import { TFunction } from "i18next";

export interface GymContactInfoFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: Address;
}

export type GymContactInfoFormErrors = Omit<
  FormErrors<GymContactInfoFormData>,
  "address"
> & {
  address?: AddressFormErrors;
};

export const validateGymContactInfoFormData = (
  data: GymContactInfoFormData,
  t: TFunction<"translation", undefined>,
  countryCodes: string[],
) => {
  const { isEmpty, isPhoneNumberValid, isEmailValid } = validate();

  const errors: GymContactInfoFormErrors = {};

  if (isEmpty(data.fullName)) {
    errors.fullName = " ";
  }

  if (!isEmpty(data.email) && !isEmailValid(data.email)) {
    errors.email = t("InvalidValue", { value: t("EmailAddress") });
  }

  if (!isEmpty(data.phoneNumber) && !isPhoneNumberValid(data.phoneNumber)) {
    errors.phoneNumber = t("InvalidValue", { value: t("PhoneNumber") });
  }

  if (isEmpty(data.email) && isEmpty(data.phoneNumber)) {
    errors.email = " ";
    errors.phoneNumber = " ";
  }

  if (!isAddressEmpty(data.address)) {
    const { errors: addressErrors, hasErrors } = validateAddress(
      data.address,
      t,
      countryCodes ?? ["HU"],
    );

    if (hasErrors) {
      errors.address = addressErrors;
    }
  }

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
};
