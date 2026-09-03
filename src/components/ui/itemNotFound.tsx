import { Button } from "@ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { ArrowLeft, LucideIcon, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type ItemNotFoundProps = {
  Icon?: LucideIcon;
  resourceName: string;
  navigateBackToPagePath: string;
  backToPageButtonLabel: string;
};

export function ItemNotFound({
  Icon,
  resourceName,
  navigateBackToPagePath,
  backToPageButtonLabel,
}: ItemNotFoundProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const NotFoundIcon = Icon ?? SearchX;

  return (
    <div className="flex min-h-[60vh] flex-col gap-4">
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md border-dashed bg-muted/40">
          <CardHeader className="flex flex-col items-center space-y-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
              <NotFoundIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">
              {t("ResourceNotFound", { resource: t(resourceName) })}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-2">
            <Button
              className="w-full sm:w-auto"
              onClick={() => navigate(navigateBackToPagePath)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t(backToPageButtonLabel)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
