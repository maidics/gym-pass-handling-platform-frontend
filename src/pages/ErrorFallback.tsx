import type { FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import ErrorCard from "@components/error/ErrorCard.tsx";

export default function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <ErrorCard
        navigationButtonLabel={t("Dashboard")}
        navigateTo="/"
        resetErrorBoundary={resetErrorBoundary}
        showResetErrorBoundary
      />
    </div>
  );
}
