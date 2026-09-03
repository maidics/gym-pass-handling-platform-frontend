import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle, Loader2, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Card } from "@ui/card.tsx";
import { Button } from "@ui/button.tsx";
import { Input } from "@ui/input.tsx";
import AppLogo from "@ui/appLogo.tsx";
import { ThemeToggle } from "@components/ui/themeToggle";
import { LanguageSwitcher } from "@ui/languageSwitcher.tsx";
import { useResetPasswordForm } from "@hooks/user/useResetPasswordForm.ts";

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const rawToken = searchParams.get("token") || "";
  const rawUser = searchParams.get("user") || "";

  const {
    data,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    isSuccess,
    isUrlValid,
  } = useResetPasswordForm(rawUser, rawToken);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            {t("PasswordResetToast")}
          </h1>
          <div className="flex items-center justify-center gap-2 text-primary animate-pulse text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> {t("Redirecting")}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <LanguageSwitcher className="fixed top-6 right-20 z-50" />
      <ThemeToggle className="fixed top-6 right-6 z-50" />

      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-3">
            <AppLogo className="w-6 h-6 text-primary-foreground" />
          </div>

          <h1 className="text-xl font-semibold text-foreground">
            {t("PasswordReset")}
          </h1>
          {isUrlValid && (
            <p className="text-muted-foreground text-sm mt-1">
              {t("ResetPasswordDescription")}
            </p>
          )}
        </div>

        {!isUrlValid && (
          <div className="flex flex-col items-center text-center mb-4 p-4 bg-destructive/10 rounded-md">
            <AlertCircle className="w-6 h-6 text-destructive mb-2" />
            <p className="text-destructive text-sm mb-4">
              {t("InvalidPasswordResetUrl")}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              {t("Back")}
            </Button>
          </div>
        )}

        {isUrlValid && (
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="newPassword"
              type="password"
              required
              label={t("NewPassword", "New password")}
              value={data.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              disabled={isLoading}
              startIcon={<Lock className="w-4 h-4" />}
              error={errors.newPassword}
            />

            <Input
              name="newPasswordConfirm"
              type="password"
              required
              label={t("NewPasswordConfirm", "Confirm new password")}
              value={data.newPasswordConfirm}
              onChange={(e) =>
                handleChange("newPasswordConfirm", e.target.value)
              }
              disabled={isLoading}
              startIcon={<Lock className="w-4 h-4" />}
              error={errors.newPasswordConfirm}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {t("Confirm")}
            </Button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            {t("HavingTrouble")}{" "}
            <a
              href="#"
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                toast.error(t("SupportNotAvailable"));
              }}
            >
              {t("ContactSupport")}
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PasswordReset;
