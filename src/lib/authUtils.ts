import localStorageKeys from "../constants/localStorageKeys.ts";
import { JwtToken, UserDto } from "../api/types.ts";
import { Role, roles } from "@constants/roles.ts";

export const authUtils = {
  getToken: () => localStorage.getItem(localStorageKeys.jwtToken),

  setToken: (token: JwtToken) =>
    localStorage.setItem(localStorageKeys.jwtToken, token.accessToken!),

  removeToken: () => localStorage.removeItem(localStorageKeys.jwtToken),
};

export const getNavigationPathByRole = (
  isInRole: (role: Role) => boolean,
  user: UserDto,
) => {
  return isInRole(roles.User)
    ? "/passes"
    : isInRole(roles.AppAdministrator) || isInRole(roles.PendingGymEmployee)
      ? "/requests"
      : isInRole(roles.GymAdministrator) || isInRole(roles.GymStaff)
        ? `/gyms/${user!.gymId}`
        : "/";
};
