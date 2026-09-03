import { useTranslation } from "react-i18next";
import { RequestPayloadErrorCard } from "@components/requests/RequestPayloadErrorCard.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card.tsx";
import { Separator } from "@ui/separator.tsx";
import { FieldEntryInfo } from "@ui/fieldEntryInfo.tsx";
import { Button } from "@ui/button.tsx";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GymAdminPromotionPayloadDetailsCardProps {
  payload?: string;
}

interface GymAdminPromotionDto {
  gymId: string;
  pendingGymEmployeeEmail: string;
  supervisorEmail: string;
}

export function GymAdminPromotionPayloadDetailsCard({
  payload,
}: GymAdminPromotionPayloadDetailsCardProps) {
  const { t } = useTranslation();

  if (!payload) {
    return <RequestPayloadErrorCard />;
  }

  let gymAdminPromotionDto: GymAdminPromotionDto;

  try {
    gymAdminPromotionDto = JSON.parse(payload) as GymAdminPromotionDto;
  } catch {
    return <RequestPayloadErrorCard />;
  }

  const isValid =
    gymAdminPromotionDto.gymId &&
    gymAdminPromotionDto.pendingGymEmployeeEmail &&
    gymAdminPromotionDto.supervisorEmail;

  if (!isValid) {
    return <RequestPayloadErrorCard />;
  }

  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <CardTitle>{t("GymAdminPromotionRequestDetails")}</CardTitle>

        <Button
          variant="outline"
          onClick={() => navigate(`/gyms/${gymAdminPromotionDto.gymId}`)}
          className="shrink-0"
        >
          {t("Gym")}
          <Building2 className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>

      <Separator className="mb-3" />

      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <FieldEntryInfo
            label={t("SupervisorEmail")}
            value={gymAdminPromotionDto.supervisorEmail}
          />

          <FieldEntryInfo
            label={t("PendingGymEmployeeEmail")}
            value={gymAdminPromotionDto.pendingGymEmployeeEmail}
          />
        </div>
      </CardContent>
    </Card>
  );
}
