import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@lib/utils.ts";
import { useAuth } from "@hooks/user/useAuth.ts";
import { useUpdateMyPreferredLanguage } from "@hooks/profile/useUpdateProfile.ts";
import { useDebouncedCallback } from "@hooks/utils/useDebounce.ts";
import { languageMap } from "@constants/languages.ts";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "ghost";
}

export const LanguageSwitcher = ({
  className,
  variant = "default",
}: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const { mutateAsync: updateLanguage, isPending: isLoading } =
    useUpdateMyPreferredLanguage();

  const isGhost = variant === "ghost";

  const rawLang = i18n.resolvedLanguage || i18n.language || "en";
  const currentShortLang = rawLang.split("-")[0];

  const debouncedUpdate = useDebouncedCallback((fullLangCode: string) => {
    if (user && user.preferredLanguage !== fullLangCode) {
      updateLanguage(fullLangCode);
    }
  }, 1500);

  useEffect(() => {
    if (user?.preferredLanguage) {
      const userShortLang = user.preferredLanguage.split("-")[0];
      if (userShortLang !== currentShortLang) {
        i18n.changeLanguage(user.preferredLanguage);
      }
    }
  }, [user]);

  const handleSwitch = (shortLangCode: "en" | "hu") => {
    const fullCode = languageMap[shortLangCode];

    i18n.changeLanguage(fullCode);

    debouncedUpdate(fullCode);
  };

  const getButtonClass = (lang: string) => {
    const isActive = currentShortLang === lang;

    return cn(
      "rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer",
      isGhost ? "px-2 py-1" : "px-3 py-1.5",
      isActive
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
    );
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 transition-all duration-200",
        !isGhost &&
          "h-10 p-1 rounded-xl bg-white/80 border-2 border-primary/20 shadow-sm dark:bg-card/80 dark:border-primary/40 dark:shadow-primary/10 backdrop-blur-md",
        isGhost && "h-auto p-0 bg-transparent border-0 shadow-none",
        className,
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSwitch("en");
        }}
        className={getButtonClass("en")}
        disabled={isLoading}
      >
        EN
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSwitch("hu");
        }}
        className={getButtonClass("hu")}
        disabled={isLoading}
      >
        HU
      </button>
    </div>
  );
};
