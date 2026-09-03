import { Mail, Lock } from "lucide-react";
import { Input } from "@ui/input.tsx";
import { Button } from "@ui/button.tsx";
import { useTranslation } from "react-i18next";
import { useLoginForm } from "@hooks/user/useLoginForm.ts";

export const LoginForm = ({
  setResetPasswordMode,
}: {
  setResetPasswordMode: () => void;
}) => {
  const { t } = useTranslation();

  const { data, isLoading, errors, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate={true}>
      <Input
        type="email"
        name="email"
        startIcon={<Mail className="w-4 h-4" />}
        placeholder={t("EmailAddress")}
        value={data.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
      />

      <div className="space-y-1">
        <Input
          type="password"
          name="password"
          placeholder={t("Password")}
          startIcon={<Lock className="w-4 h-4" />}
          value={data.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-primary hover:underline cursor-pointer"
          onClick={() => setResetPasswordMode()}
          tabIndex={-1}
        >
          {t("ForgotPassword")}
        </button>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {t("SignIn")}
      </Button>
    </form>
  );
};
