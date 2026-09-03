import { PassType } from "@api/types.ts";

export const getPassTypeConfig = (type: PassType) => {
  switch (type) {
    case "SingleUse":
      return {
        variant: "default" as const,
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      };
    case "MultiUse":
      return {
        variant: "default" as const,
        className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      };
    case "Unlimited":
      return {
        variant: "default" as const,
        className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      };
    default:
      return { variant: "secondary" as const, className: "" };
  }
};
