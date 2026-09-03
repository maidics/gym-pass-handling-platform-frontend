import * as React from "react";
import { cn } from "@lib/utils.ts";
import { Label } from "./label.tsx";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: React.ReactNode;
  description?: React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, required, error, description, className, id, ...props }, ref) => {
    const descriptionId = id ? `${id}-description` : undefined;
    const errorId = id ? `${id}-error` : undefined;

    const ariaDescribedBy = error
      ? errorId
      : description
        ? descriptionId
        : undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <Label required={required} htmlFor={id}>
            {label}
          </Label>
        )}

        <textarea
          id={id}
          ref={ref}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!error}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input",
            className,
          )}
          {...props}
        />

        {error && String(error).trim() !== "" ? (
          <div id={errorId} className="text-sm font-medium text-destructive">
            {error}
          </div>
        ) : description ? (
          <div id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </div>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
