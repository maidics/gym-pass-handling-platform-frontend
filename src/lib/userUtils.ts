import { roles } from "../constants/roles.ts";

export const getGymEmployeeRoleConfig = (
  role: typeof roles.GymAdministrator | typeof roles.GymStaff,
) => {
  switch (role) {
    case "GymAdministrator":
      return {
        label: "GymAdministrator",
        variant: "default" as const,
        className: "bg-primary",
      };
    case "GymStaff":
      return {
        label: "GymStaff",
        variant: "secondary" as const,
        className: "bg-secondary",
      };
  }
};
