import { Role, roles } from "@constants/roles.ts";
import { RequestStatus } from "@api/types.ts";

export const showDemoteGymStaffToPendingGymEmployeeButton = (
  isInRole: (role: Role) => boolean,
  userGymId: string | undefined,
  employeeRole: Role,
  employeeGymId: string,
) => {
  return (
    isInRole(roles.GymAdministrator) &&
    employeeRole === roles.GymStaff &&
    employeeGymId === userGymId
  );
};

export const showHandleRequestButton = (
  isInRole: (role: Role) => boolean,
  requestStatus: RequestStatus | undefined,
) => {
  return isInRole(roles.AppAdministrator) && requestStatus === "Submitted";
};

export const showCancelRequestButton = (
  isInRole: (role: Role) => boolean,
  requestStatus: RequestStatus | undefined,
  userId: string,
  requestCreatorId: string | undefined,
) => {
  return (
    !isInRole(roles.AppAdministrator) &&
    requestStatus === "Submitted" &&
    userId === requestCreatorId
  );
};

export const showTenantPaymentProfile = (
  isInRole: (role: Role) => boolean,
  userGymId: string,
  gymId: string,
) => {
  return isInRole(roles.GymAdministrator) && userGymId === gymId;
};

export const showUpdateGymProfileButton = (
  isInRole: (role: Role) => boolean,
  isManagedGym: (id: string | undefined) => boolean,
  gymId: string | undefined,
) => {
  return isInRole(roles.GymAdministrator) && isManagedGym(gymId);
};

export const showUpdateGymStatusButton = (
  isInRole: (role: Role) => boolean,
  isManagedGym: (id: string | undefined) => boolean,
  gymId: string | undefined,
) => {
  return (
    (isInRole(roles.GymAdministrator) && isManagedGym(gymId)) ||
    isInRole(roles.AppAdministrator)
  );
};

export const showEmployeesButton = (
  isManagedGym: (id: string | undefined) => boolean,
  gymId: string | undefined,
) => {
  return isManagedGym(gymId);
};

export const showCreateGymPassProductButton = (
  isInRole: (role: Role) => boolean,
  isManagedGym: (gymId: string | undefined) => boolean,
  gymId: string | undefined,
) => {
  return isInRole(roles.GymAdministrator) && isManagedGym(gymId);
};

export const showManageGymContactInfoButtons = (
  isInRole: (role: Role) => boolean,
  isManagedGym: (gymId: string | undefined) => boolean,
  gymId: string | undefined,
) => {
  return isInRole(roles.GymAdministrator) && isManagedGym(gymId);
};

export const showManageGymPassUsageButtons = (
  isInRoles: (role: Role) => boolean,
  successFulUse: boolean,
  end: Date | null,
) => {
  return (
    (isInRoles(roles.GymAdministrator) || isInRoles(roles.GymStaff)) &&
    successFulUse &&
    !end
  );
};
