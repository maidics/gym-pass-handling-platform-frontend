import { useTranslation } from "react-i18next";
import { Input } from "@components/ui/input";
import {
  GymContactInfoFormData,
  GymContactInfoFormErrors,
} from "@lib/gymContactInfoUtils.ts";
import { Label } from "@ui/label.tsx";
import { Info } from "lucide-react";
import { validate } from "@lib/validationUtils.ts";
import { AddressInput } from "@components/address/AddressInput.tsx";
import { isAddressEmpty } from "@lib/addressUtils.ts";
import { Address } from "@api/types.ts";

interface GymContactInfoInputProps {
  data: GymContactInfoFormData;
  errors: GymContactInfoFormErrors;
  handleChange: <K extends keyof GymContactInfoFormData>(
    field: K,
    value: GymContactInfoFormData[K],
  ) => void;
  handleAddressChange: <K extends keyof Address>(
    field: K,
    value: Address[K],
  ) => void;
}

export function GymContactInfoInput({
  data,
  errors,
  handleChange,
  handleAddressChange,
}: GymContactInfoInputProps) {
  const { t } = useTranslation();
  const { isEmpty } = validate();

  const isPhoneEmpty = isEmpty(data.phoneNumber);
  const isEmailEmpty = isEmpty(data.email);

  return (
    <>
      <Input
        id="fullName"
        label={t("FullName")}
        required
        value={data.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
        className="mb-3"
        error={errors.fullName}
      />
      <Label className="flex items-center text-sm text-muted-foreground">
        <Info className="h-4 w-4 mr-1" />
        {t("FieldIsRequired", { field: t("EmailOrPhoneNumber") })}
      </Label>
      <Input
        id="email"
        label="Email"
        placeholder={t("EmailExample")}
        required={isPhoneEmpty}
        value={data.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
      />
      <Input
        id="phoneNumber"
        label={t("Phone")}
        required={isEmailEmpty}
        value={data.phoneNumber}
        onChange={(e) => handleChange("phoneNumber", e.target.value)}
        placeholder="+14155552671"
        className="mb-3"
        error={errors.phoneNumber}
      />
      <Label className="flex items-center text-sm text-muted-foreground">
        <Info className="h-4 w-4 mr-1 shrink-0" />
        {t("AddressIsNotRequiredButIfProvidedMustBeFulfilledCorrectly")}
      </Label>
      <AddressInput
        label="BusinessAddress"
        address={data.address}
        onChange={handleAddressChange}
        errors={errors.address}
        required={!isAddressEmpty(data.address)}
      />
    </>
  );
}
