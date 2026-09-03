import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { GymMembershipWithUserProfileAndEmailDto } from "@api/types";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: GymMembershipWithUserProfileAndEmailDto | null;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
};

export function BanMemberDialog({
  open,
  onOpenChange,
  member,
  onConfirm,
  isPending,
}: Props) {
  const { t } = useTranslation();

  const fullName = member
    ? `${member.userProfile.firstName} ${member.userProfile.lastName}`
    : "";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("BanMember")}?</AlertDialogTitle>
          <AlertDialogDescription>
            {t("BanGymMembershipDescription", {
              name: fullName,
              email: member?.userProfile.email,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void onConfirm();
            }}
            disabled={!member || isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("Ban")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
