import { ApproveRequestDialog } from "@components/requests/ApproveRequestDialog.tsx";
import { useFulfillOtherRequest } from "@hooks/requests/useHandleRequests.ts";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ApproveOtherRequestDialog({
  requestId,
}: {
  requestId: string;
}) {
  const { t } = useTranslation();

  const { mutateAsync: fulFill, isPending } = useFulfillOtherRequest(requestId);

  return (
    <ApproveRequestDialog
      HeaderIcon={FileText}
      description={t("OtherRequestApproveDescription")}
      notice={t("CannotUndoThisAction")}
      loadingLabel={t("ApprovePending")}
      isPending={isPending}
      approveFn={async () => fulFill()}
    />
  );
}
