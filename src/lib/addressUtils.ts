import { Address } from "../api/types.ts";
import { validate } from "@lib/validationUtils.ts";
import { FormErrors } from "@lib/formUtils.ts";
import { TFunction } from "i18next";

export const formatFullAddress = (address: Address) => {
  const parts = [address.line1];
  if (address.line2) parts.push(address.line2);
  parts.push(
    `${address.city}${address.state ? `, ${address.state}` : ""} ${address.postalCode}`,
  );
  parts.push(address.countryAlpha2);
  return parts.join(", ");
};

export const emptyAddress: Address = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  countryAlpha2: "",
};

export const isAddressEmpty = (a: Address): boolean => {
  const { isEmpty } = validate();

  return Object.values(a).every(isEmpty);
};

export type AddressFormErrors = FormErrors<Address>;

export const validateAddress = (
  a: Address,
  t: TFunction<"translation", undefined>,
  countryCodes: string[],
) => {
  const { isEmpty } = validate();

  const errors: AddressFormErrors = {};

  if (isEmpty(a.line1)) {
    errors.line1 = " ";
  }

  if (isEmpty(a.city)) {
    errors.city = " ";
  }

  if (isEmpty(a.postalCode)) {
    errors.postalCode = " ";
  }

  if (isEmpty(a.countryAlpha2)) {
    errors.countryAlpha2 = " ";
  } else if (a.countryAlpha2.length != 2) {
    errors.countryAlpha2 = t("CountryCodeRule");
  } else if (!countryCodes?.includes(a.countryAlpha2)) {
    errors.countryAlpha2 = t("InvalidValue", { value: t("Country") });
  }

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
};
