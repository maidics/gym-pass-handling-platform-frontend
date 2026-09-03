import { Mail, ArrowLeft } from "lucide-react";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { useTranslation } from "react-i18next";
import { useSendPasswordResetEmailForm } from "@hooks/user/useSendPasswordResetEmailForm.ts";

export const PasswordResetRequestForm = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const { t } = useTranslation();

  const { email, error, handleChange, handleSubmit, isLoading } =
    useSendPasswordResetEmailForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          {t("PasswordReset")}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("SendPasswordResetEmailDescription")}
        </p>
      </div>

      <Input
        id="email"
        type="email"
        name="email"
        required
        placeholder={t("EmailExample")}
        value={email}
        onChange={handleChange}
        startIcon={<Mail className="w-4 h-4" />}
        error={error}
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {t("SendPasswordResetEmail")}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full gap-2 text-muted-foreground hover:text-foreground"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("Back")}
      </Button>
    </form>
  );
};
