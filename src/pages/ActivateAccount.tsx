import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { LanguageSwitcher } from "@ui/languageSwitcher.tsx";
import { ThemeToggle } from "@components/ui/themeToggle";
import { Card } from "@ui/card.tsx";
import { Button } from "@ui/button.tsx";
import { Input } from "@ui/input.tsx";
import AppLogo from "@ui/appLogo.tsx";
import { useActivateAccountForm } from "@hooks/user/useActivateAccountForm.ts";

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const rawToken = searchParams.get("token") || "";
  const rawEmail = searchParams.get("user") || "";

  const setPasswordFlag =
    searchParams.get("setPassword") === "true" ||
    Array.from(searchParams.entries()).some(
      ([key, val]) => key === "" && val === "flag1",
    );

  const isUrlValid = !!rawToken && !!rawEmail;

  const { data, errors, isLoading, handleChange, handleSubmit, isSuccess } =
    useActivateAccountForm(rawEmail, rawToken, setPasswordFlag);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <LanguageSwitcher className="fixed top-6 right-20 z-50" />
        <ThemeToggle className="fixed top-6 right-6 z-50" />
        <Card className="w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            {t("AccountActivated")}
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            {setPasswordFlag
              ? t("ActivationWithPasswordDescription")
              : t("ActivationDescription")}
          </p>
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
          <h1 className="text-l font-semibold text-foreground">
            {setPasswordFlag
              ? t("ConfirmEmailAndSetPassword")
              : t("ConfirmEmail")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{rawEmail}</p>
        </div>

        {!isUrlValid && (
          <div className="flex flex-col items-center text-center mb-4 p-4 bg-destructive/10 rounded-md">
            <AlertCircle className="w-6 h-6 text-destructive mb-2" />
            <p className="text-destructive text-sm mb-4">
              {t("InvalidActivationUrl")}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              {t("ReturnToHome")}
            </Button>
          </div>
        )}

        {isUrlValid && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {setPasswordFlag && (
              <>
                <Input
                  name="password"
                  type="password"
                  required
                  label={t("Password")}
                  value={data.password ?? ""}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                  startIcon={<Lock className="w-4 h-4" />}
                  error={errors.password}
                />

                <Input
                  name="passwordConfirm"
                  label={t("PasswordConfirm")}
                  required
                  type="password"
                  value={data.passwordConfirm ?? ""}
                  onChange={(e) =>
                    handleChange("passwordConfirm", e.target.value)
                  }
                  className="pr-10"
                  disabled={isLoading}
                  startIcon={<Lock className="w-4 h-4" />}
                  error={errors.passwordConfirm}
                />
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                </>
              ) : (
                t("Confirm")
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            {t("HavingTrouble")}{" "}
            <a
              href="#"
              className="text-primary hover:underline"
              onClick={() => toast.error(t("SupportNotAvailable"))}
            >
              {t("ContactSupport")}
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ActivateAccount;
