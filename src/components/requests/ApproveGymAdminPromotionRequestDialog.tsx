import { useTranslation } from "react-i18next";
import { UserCog } from "lucide-react";
import { ApproveRequestDialog } from "@components/requests/ApproveRequestDialog.tsx";
import { useGymAdminPromotionFromRequest } from "@hooks/requests/useHandleRequests.ts";

export function ApproveGymAdminPromotionRequestDialog({
  requestId,
}: {
  requestId: string;
}) {
  const { t } = useTranslation();

  const { mutate: promoteUser, isPending } =
    useGymAdminPromotionFromRequest(requestId);

  return (
    <ApproveRequestDialog
      HeaderIcon={UserCog}
      description={t("GymAdminPromotionRequestDescription")}
      notice={t("CannotUndoThisAction")}
      approveLabel={t("ApproveAndPromote")}
      isPending={isPending}
      approveFn={async () => promoteUser()}
    />
  );
}
