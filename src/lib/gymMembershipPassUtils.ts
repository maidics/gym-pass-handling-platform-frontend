import { formatDateTime } from "@lib/dateTimeUtils.ts";
import { GymMembershipPassDto } from "@api/types.ts";

export const getGymMembershipPassStatus = (
  pass: GymMembershipPassDto,
): {
  labelKey: string;
  isValid: boolean;
  usesRemainingKey: [
    key: string,
    { date: string } | { count: number | undefined; total: number | undefined },
  ];
} => {
  if (pass.type === "Unlimited") {
    const isExpired =
      pass.expirationDate && new Date(pass.expirationDate) < new Date();
    return {
      labelKey: isExpired ? "Expired" : "Valid",
      isValid: !isExpired,
      usesRemainingKey: [
        "ExpiresInfo",
        { date: formatDateTime(pass.expirationDate) },
      ],
    };
  }

  const hasUses = (pass.remainingUses ?? 0) > 0;

  return {
    labelKey: hasUses ? "Valid" : "Used",
    isValid: hasUses,
    usesRemainingKey: [
      "RemainingUsesInfo",
      { count: pass.remainingUses, total: pass.totalUses },
    ],
  };
};

//QR Code
export type ParsedGymMembershipPassQr = {
  gymMembershipPassId: string;
  userId: string;
};

export function parseGymMembershipPassQR(
  text: string,
): ParsedGymMembershipPassQr | null {
  const parts = text.split("_");
  if (parts.length !== 2) return null;

  const [gymMembershipPassId, userId] = parts;
  if (!gymMembershipPassId || !userId) return null;

  return { gymMembershipPassId, userId };
}
