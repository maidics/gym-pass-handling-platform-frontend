import { GymMembershipStatus } from "@api/types.ts";

export const getGymMembershipStatusConfig = (status: GymMembershipStatus) => {
  switch (status) {
    case "Active":
      return {
        label: "Active",
        variant: "default" as const,
        className: "bg-primary/10 text-primary hover:bg-primary/20",
      };
    case "Banned":
      return {
        label: "Suspended",
        variant: "destructive" as const,
        className: "",
      };
  }
};
