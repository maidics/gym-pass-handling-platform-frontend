import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ClientNotification } from "@api/types";
import { gymMembershipPassKeys } from "@hooks/gymMembershipPasses/useGetGymMembershipPasses";
import { startUserEventsStream } from "@api/notificationStream.ts";
import { gymPassUsageKeys } from "@hooks/gymPassUsages/useGetGymPassUsages.ts";
import { gymKeys } from "@hooks/gyms/useGetGyms.ts";
import { useAuth } from "@hooks/user/useAuth.ts";

export function useClientNotifications(enabled: boolean) {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const onNotification = useCallback(
    (n: ClientNotification) => {
      switch (n.type) {
        case "Error":
        case "PaymentFailed":
          toast.error(n.message);
          break;

        case "GymMembershipStatusChange":
        case "GymPassProductPurchaseFulfillmentFailed":
          toast.warning(n.message);
          break;

        case "SuccessfulPurchase":
          toast.success(n.message);
          queryClient.invalidateQueries({ queryKey: gymMembershipPassKeys.my });
          break;

        case "GymSessionEnded":
        case "GymPassUsageLockerUpdated":
          toast.info(n.message);
          queryClient.invalidateQueries({ queryKey: gymPassUsageKeys.my });
          break;

        case "GymStatusUpdatedByAppAdmin":
          toast.warning(n.message);
          queryClient.invalidateQueries({
            queryKey: gymKeys.gym(user!.gymId!),
          });
          break;

        default:
          toast.message(n.message);
          break;
      }
    },
    [queryClient],
  );

  useEffect(() => {
    if (!enabled) return;

    const lang = i18n.resolvedLanguage ?? i18n.language ?? "en";
    return startUserEventsStream({ language: lang, onNotification });
  }, [enabled, onNotification, i18n.resolvedLanguage, i18n.language]);
}
