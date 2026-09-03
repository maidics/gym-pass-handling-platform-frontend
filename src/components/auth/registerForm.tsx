import { User, Lock, Mail, BadgeInfo, Globe } from "lucide-react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@ui/checkbox.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip.tsx";
import { useRegisterForm } from "@hooks/user/useRegisterForm.ts";
import { Label } from "@ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select.tsx";
import { languageMap } from "@constants/languages.ts";

export const RegisterForm = () => {
  const { t } = useTranslation();

  const languageOptions = Object.entries(languageMap);

  const { data, errors, handleChange, handleSubmit, isLoading } =
    useRegisterForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          name="firstName"
          placeholder={t("FirstName")}
          value={data.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          error={errors.firstName}
          startIcon={<User className="w-4 h-4" />}
        />

        <Input
          type="text"
          name="lastName"
          placeholder={t("LastName")}
          value={data.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          error={errors.lastName}
          startIcon={<User className="w-4 h-4" />}
        />
      </div>

      <Input
        type="email"
        name="email"
        placeholder={t("EmailAddress")}
        value={data.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
        startIcon={<Mail className="w-4 h-4" />}
      />

      <Input
        type="password"
        name="password"
        placeholder={t("Password")}
        value={data.password}
        onChange={(e) => handleChange("password", e.target.value)}
        error={errors.password}
        startIcon={<Lock className="w-4 h-4" />}
      />

      <Input
        type="password"
        name="passwordConfirm"
        placeholder={t("PasswordConfirm")}
        value={data.passwordConfirm}
        onChange={(e) => handleChange("passwordConfirm", e.target.value)}
        error={errors.passwordConfirm}
        startIcon={<Lock className="w-4 h-4" />}
      />

      <div className="flex items-center justify-between p-1 pt-2">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="gym-employee"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none cursor-pointer"
          >
            {t("GymEmployee")}
          </Label>
          <Checkbox
            id="gym-employee"
            className="cursor-pointer"
            checked={data.asPendingGymEmployee}
            onCheckedChange={(checked) =>
              handleChange("asPendingGymEmployee", checked as boolean)
            }
          />

          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <BadgeInfo className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[280px]" side="top">
              <p>{t("PendingGymEmployeeTooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="relative w-[110px]">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
            <Globe className="w-3.5 h-3.5" />
          </div>

          <Select
            value={data.preferredLanguage}
            onValueChange={(x) => handleChange("preferredLanguage", x)}
          >
            <SelectTrigger className="h-8 pl-8 text-xs bg-background">
              <SelectValue placeholder={t("SelectLanguage")} />
            </SelectTrigger>
            <SelectContent align="end">
              {languageOptions.map(([key, value]) => (
                <SelectItem key={key} value={value} className="text-xs">
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {t("Register")}
      </Button>
    </form>
  );
};
