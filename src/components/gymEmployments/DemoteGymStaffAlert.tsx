import { Button } from "@ui/button.tsx";
import { UserMinus } from "lucide-react";
import { useDemoteGymStaffToPendingGymEmployee } from "@hooks/user/useUpdateUser.ts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog.tsx";

interface DemoteGymStaffAlertProps {
  userId: string;
  gymId?: string;
  label?: string;
}

export function DemoteGymStaffAlert({
  userId,
  gymId,
  label,
}: DemoteGymStaffAlertProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: demote, isPending: isLoading } =
    useDemoteGymStaffToPendingGymEmployee();

  const handleConfirm = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    await demote({ userId });

    if (gymId) {
      navigate(`/gyms/${gymId}/employees`);
    }
  };

  const handleCancelClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="ml-1 hover:text-destructive"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <UserMinus className="h-4 w-4" />
          {label && <span className="ml-2">{label}</span>}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("DemoteGymStaffAlertTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("DemoteGymStaffAlertDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={handleCancelClick}>
            {t("Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {t("Confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
