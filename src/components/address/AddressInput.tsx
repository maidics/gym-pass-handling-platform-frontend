import { Label } from "@ui/label.tsx";
import { Input } from "@ui/input.tsx";
import { useTranslation } from "react-i18next";
import { Address } from "@api/types.ts";
import { AddressFormErrors } from "@lib/addressUtils.ts";

interface AddressInputProps {
  label: "translation";
  address: Address;
  onChange: (field: keyof Address, value: string) => void;
  errors?: AddressFormErrors;
  required?: boolean;
}

export function AddressInput({
  label,
  address,
  onChange,
  errors,
  required = true,
}: AddressInputProps) {
  const { t } = useTranslation();

  return (
    <>
      <Label className="block mb-4 font-semibold">{t(label)}</Label>

      <div className="space-y-4">
        <div className="relative">
          <Input
            id="addressLine1"
            placeholder={t("AddressLine1Example")}
            label={t("AddressLine1")}
            required={required}
            value={address.line1}
            onChange={(e) => onChange("line1", e.target.value)}
            error={errors?.line1}
          />
        </div>

        <div>
          <Input
            id="addressLine2"
            label={t("AddressLine2")}
            placeholder={t("AddressLine2Example")}
            value={address.line2 || ""}
            onChange={(e) => onChange("line2", e.target.value)}
            error={errors?.line2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Input
              id="city"
              label={t("City")}
              required={required}
              placeholder={t("CityExample")}
              value={address.city}
              onChange={(e) => onChange("city", e.target.value)}
              error={errors?.city}
            />
          </div>

          <div>
            <Input
              id="state"
              label={t("State")}
              placeholder={t("StateExample")}
              value={address.state || ""}
              onChange={(e) => onChange("state", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Input
              id="postalCode"
              label={t("PostalCode")}
              required={required}
              placeholder={t("PostalCodeExample")}
              value={address.postalCode}
              onChange={(e) => onChange("postalCode", e.target.value)}
              error={errors?.postalCode}
            />
          </div>

          <div className="relative">
            <Input
              id="countryCode"
              label={t("CountryCode")}
              required={required}
              placeholder={t("CountryCodeExample")}
              value={address.countryAlpha2}
              onChange={(e) =>
                onChange(
                  "countryAlpha2",
                  e.target.value.toUpperCase().slice(0, 2),
                )
              }
              maxLength={2}
              error={errors?.countryAlpha2}
            />
          </div>
        </div>
      </div>
    </>
  );
}
