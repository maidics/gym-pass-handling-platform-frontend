import { GymDto } from "@api/types";
import { Card, CardTitle } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { useTranslation } from "react-i18next";
import { CardContent } from "@components/ui/card";
import { CardHeader } from "@components/ui/card";
import { formatDateTime } from "@lib/dateTimeUtils.ts";
import { AddressInfo } from "@components/address/AddressInfo.tsx";

export function GymOverviewCard({ gym }: { gym: GymDto }) {
  const { t } = useTranslation();
  const passesCount = gym.passProducts?.length ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{t("Details")}</CardTitle>
      </CardHeader>

      <Separator className="mb-3" />

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 text-sm">
          <AddressInfo address={gym.address} />

          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("Created")}</dt>
              <dd className="font-medium">{formatDateTime(gym.createdOn)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("Tier")}</dt>
              <dd className="font-medium">{gym.tier}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("Status")}</dt>
              <dd className="font-medium">{t(gym.status)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("PassesOrTickets")}</dt>
              <dd className="font-medium">{passesCount}</dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
