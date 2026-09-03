import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "./label.tsx";
import { cn } from "@lib/utils.ts";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: React.ReactNode;
  description?: React.ReactNode;
  startIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required,
      error,
      description,
      className,
      type,
      id,
      startIcon,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";
    const inputType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type;

    const descriptionId = id ? `${id}-description` : undefined;
    const errorId = id ? `${id}-error` : undefined;
    const ariaDescribedBy = error
      ? errorId
      : description
        ? descriptionId
        : undefined;

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <Label required={required} htmlFor={id}>
            {label}
          </Label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
              {startIcon}
            </div>
          )}

          <input
            id={id}
            ref={ref}
            type={inputType}
            aria-describedby={ariaDescribedBy}
            aria-invalid={!!error}
            className={cn(
              "w-full px-3 py-2 text-sm bg-background border rounded-md transition-colors",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              startIcon ? "pl-10" : "",
              isPasswordType && "pr-10",
              error
                ? "border-destructive focus:ring-destructive"
                : "border-input",
              className,
            )}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute right-0 top-0 h-full px-3 ",
                "text-muted-foreground hover:text-foreground hover:bg-transparent",
                "flex items-center justify-center transition-colors",
                "cursor-pointer",
              )}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </button>
          )}
        </div>

        {error && String(error).trim() !== "" ? (
          <div id={errorId} className="text-sm text-destructive font-medium">
            {error}
          </div>
        ) : description ? (
          <div
            id={descriptionId}
            className="text-sm text-muted-foreground text-justify"
          >
            {description}
          </div>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
