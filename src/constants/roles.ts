export const roles = {
  AppAdministrator: "AppAdministrator",
  GymAdministrator: "GymAdministrator",
  GymStaff: "GymStaff",
  PendingGymEmployee: "PendingGymEmployee",
  User: "User",
} as const;

export type Role = (typeof roles)[keyof typeof roles];
