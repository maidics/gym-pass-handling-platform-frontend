import { CreateGymDto } from "@api/types.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card.tsx";
import { useTranslation } from "react-i18next";
import { RequestPayloadErrorCard } from "@components/requests/RequestPayloadErrorCard.tsx";
import { validateAddress } from "@lib/addressUtils.ts";
import { useCountryAlpha2Codes } from "@hooks/referenceData/useReferenceData.ts";
import { AddressInfo } from "@components/address/AddressInfo.tsx";
import { FieldEntryInfo } from "@ui/fieldEntryInfo.tsx";
import { Separator } from "@ui/separator.tsx";

interface GymCreationPayloadDetailsCardProps {
  payload?: string;
}

export function GymCreationPayloadDetailsCard({
  payload,
}: GymCreationPayloadDetailsCardProps) {
  const { t } = useTranslation();
  const { data: countryCodes } = useCountryAlpha2Codes();

  if (!payload) {
    return <RequestPayloadErrorCard />;
  }

  let createGymDto: CreateGymDto;

  try {
    createGymDto = JSON.parse(payload) as CreateGymDto;
  } catch {
    return <RequestPayloadErrorCard />;
  }

  const isValid =
    createGymDto &&
    createGymDto.name &&
    createGymDto.address &&
    !validateAddress(createGymDto.address, t, countryCodes!).hasErrors &&
    createGymDto.status &&
    createGymDto.tier &&
    createGymDto.supervisorEmail;

  if (!isValid) {
    return <RequestPayloadErrorCard />;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t("GymDetails")}</CardTitle>
      </CardHeader>

      <Separator className="mb-3" />

      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <FieldEntryInfo label={t("Name")} value={createGymDto.name} />

          <FieldEntryInfo
            label={t("SupervisorEmail")}
            value={createGymDto.supervisorEmail}
          />

          <FieldEntryInfo label={t("Status")} value={t(createGymDto.status)} />

          <FieldEntryInfo label={t("Tier")} value={t(createGymDto.tier)} />

          <AddressInfo address={createGymDto.address} />
        </div>
      </CardContent>
    </Card>
  );
}
