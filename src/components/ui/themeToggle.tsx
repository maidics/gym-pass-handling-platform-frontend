import { Moon, Sun } from "lucide-react";
import { cn } from "@lib/utils.ts";
import { useTheme } from "@hooks/utils/useTheme.ts";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer",
        "bg-white/80 border-2 border-primary/40 shadow-sm",
        "dark:bg-card/80 dark:border-primary/60 dark:shadow-primary/10",
        "hover:scale-105 active:scale-95 hover:border-primary",
        className,
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
};
