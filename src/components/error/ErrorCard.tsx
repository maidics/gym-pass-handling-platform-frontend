import { Card } from "@ui/card.tsx";
import { Frown } from "lucide-react";
import { Button } from "@ui/button.tsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ErrorCard({
  navigateTo,
  navigationButtonLabel,
  resetErrorBoundary,
  showResetErrorBoundary,
}: {
  navigationButtonLabel: string;
  navigateTo: number | string;
  showResetErrorBoundary?: boolean;
  resetErrorBoundary?: (...args: unknown[]) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
        <Frown className="w-10 h-10" />
      </div>

      <h1 className="text-xl font-semibold mb-2">{t("UnexpectedError")}</h1>
      <p className="text-white/90 font-medium text-md mb-4">
        {t("SorryForTheInconvenience")}
      </p>

      <div className="flex gap-2 justify-center">
        {/* @ts-ignore */}
        <Button variant="outline" onClick={() => navigate(navigateTo)}>
          {navigationButtonLabel}
        </Button>
        {showResetErrorBoundary && (
          <Button onClick={resetErrorBoundary}>{t("TryAgain")}</Button>
        )}
      </div>
    </Card>
  );
}
