import { Address } from "@api/types.ts";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

function formatAddress(address: Address) {
  const parts = [address.line1];
  if (address.line2) parts.push(address.line2);
  parts.push(
    `${address.city}${address.state ? `, ${address.state}` : ""} ${address.postalCode}`,
  );
  parts.push(address.countryAlpha2);
  return parts;
}

interface AddressInfoProps {
  address: Address;
  label?: "translation";
}

export function AddressInfo({ address, label }: AddressInfoProps) {
  const { t } = useTranslation();

  return (
    <div>
      <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {t(label ?? "Address")}
      </p>
      <div className="mt-1 space-y-0.5">
        {formatAddress(address).map((line, i) => (
          <p
            key={i}
            className={i === 0 ? "font-medium" : "text-muted-foreground"}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
