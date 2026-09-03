import { cn } from "@lib/utils.ts";
import React from "react";

interface CenterProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

export const Center = ({ className, children, ...props }: CenterProps) => {
  return (
    <div
      className={cn(
        "flex min-h-screen w-full items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
