import { Card } from "@ui/card.tsx";
import { RegisterForm } from "./RegisterForm.tsx";
import { AccountActivationForm } from "./AccountActivationForm.tsx";
import { LoginForm } from "./LoginForm.tsx";
import { PasswordResetRequestForm } from "./SendPasswordResetEmailForm.tsx";
import { Trans, useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip.tsx";
import { BadgeInfo } from "lucide-react";
import { useState } from "react";
import AppLogo from "@ui/appLogo.tsx";

export type AuthMode = "login" | "register" | "activate" | "reset";

export const AuthCard = () => {
  const { t } = useTranslation();
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const showTabs = authMode === "login" || authMode === "register";

  return (
    <Card className="w-full max-w-md p-8 border-0 shadow-none md:border md:shadow-sm">
      {showTabs && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-3">
            <AppLogo />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("Welcome")}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {authMode === "login"
              ? t("SignIntoYourAccount")
              : t("RegisterNewAccount")}
          </p>
        </div>
      )}

      {showTabs && (
        <div className="flex p-1 mb-6 rounded-md bg-muted">
          <button
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
              authMode === "login"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("SignIn")}
          </button>
          <button
            onClick={() => setAuthMode("register")}
            className={`flex-1 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
              authMode === "register"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("Registration")}
          </button>
        </div>
      )}

      {authMode === "login" && (
        <LoginForm setResetPasswordMode={() => setAuthMode("reset")} />
      )}
      {authMode === "register" && <RegisterForm />}

      {authMode === "activate" && (
        <AccountActivationForm onBack={() => setAuthMode("login")} />
      )}

      {authMode === "reset" && (
        <PasswordResetRequestForm onBack={() => setAuthMode("login")} />
      )}

      {authMode !== "activate" && authMode !== "reset" && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAuthMode("activate")}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              {t("AccountActivation")}
            </button>

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <BadgeInfo className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] break-words" side="top">
                <p>{t("AccountActivationToolTip")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          <Trans i18nKey="AgreeWithContinueToTermsAndPrivacy">
            <span className="text-primary">Terms of Service</span>
            <span className="text-primary">Privacy Policy</span>
          </Trans>
        </p>
      </div>
    </Card>
  );
};
