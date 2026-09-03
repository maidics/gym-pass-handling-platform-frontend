import { useTranslation } from "react-i18next";
import { Building2, Check } from "lucide-react";
import { ApproveRequestDialog } from "@components/requests/ApproveRequestDialog.tsx";
import { useRegisterGymFromRequest } from "@hooks/requests/useHandleRequests.ts";

export function ApproveGymCreationRequestDialog({
  requestId,
}: {
  requestId: string;
}) {
  const { t } = useTranslation();

  const { mutateAsync: registerGym, isPending } =
    useRegisterGymFromRequest(requestId);

  const handleRegister = async () => {
    await registerGym();
  };

  return (
    <ApproveRequestDialog
      triggerLabel={t("Approve")}
      TriggerIcon={Check}
      HeaderIcon={Building2}
      title={t("ApproveRequestTitle")}
      description={t("GymCreationRequestApproveDescription")}
      cancelLabel={t("Cancel")}
      approveLabel={t("ApproveAndCreateGym")}
      loadingLabel={t("ApprovePending")}
      isPending={isPending}
      approveFn={() => handleRegister()}
    />
  );
}
