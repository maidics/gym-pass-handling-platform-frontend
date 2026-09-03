import { GymPassUsageDto } from "@api/types.ts";

export function getPassUsageResultBadgeVariant(
  result: any,
): "default" | "secondary" | "destructive" {
  if (result === "Success") return "default";
  if (result === "Expired") return "destructive";
  return "secondary";
}

export const buildGymPassUsageSearchText = (u: GymPassUsageDto) => {
  const parts: string[] = [];

  const first = u.firstName?.trim();
  const last = u.lastName?.trim();
  if (first || last) parts.push([first, last].filter(Boolean).join(" "));

  if (u.passType) parts.push(String(u.passType));
  if (u.passUseResult) parts.push(String(u.passUseResult));
  if (u.lockerNumber) parts.push(String(u.lockerNumber));

  return parts.join(" ").toLowerCase();
};
