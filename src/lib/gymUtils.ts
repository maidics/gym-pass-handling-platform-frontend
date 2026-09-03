import { GymStatus, GymTier } from "../api/types.ts";

export const getGymStatusConfig = (status: GymStatus) => {
  switch (status) {
    case "Active":
      return {
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      };
    case "Inactive":
      return { className: "bg-muted text-muted-foreground" };
    case "Suspended":
      return {
        className: "bg-destructive/10 text-destructive border-destructive/20",
      };
    default:
      return { className: "" };
  }
};

export const getGymTierConfig = (tier: GymTier) => {
  switch (tier) {
    case "Local":
      return {
        className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
      };
    case "MidRange":
      return { className: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
    case "Premium":
      return {
        className: "bg-violet-500/10 text-violet-600 border-violet-500/20",
      };
    case "Elite":
      return {
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      };
    default:
      return { className: "" };
  }
};
