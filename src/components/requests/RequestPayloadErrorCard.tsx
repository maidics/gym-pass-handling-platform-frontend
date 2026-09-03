import { Card, CardContent, CardHeader, CardTitle } from "@ui/card.tsx";
import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";
import { Separator } from "@ui/separator.tsx";

export function RequestPayloadErrorCard() {
  const { t } = useTranslation();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t("Error")}</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 flex flex-col items-center justify-center gap-2">
        <p className="text-muted-foreground">
          {t("RequestPayloadErrorCardTitle")}
        </p>
        <TriangleAlert className="h-9 w-9" />
      </CardContent>
    </Card>
  );
}
