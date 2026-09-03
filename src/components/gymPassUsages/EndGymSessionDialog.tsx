import * as React from "react";
import { useTranslation } from "react-i18next";
import { KeyRound, Loader2, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { useGymEmployeeEndGymSession } from "@hooks/gymPassUsages/useUpdateGymPassUsages.ts";

type EndGymSessionDialogProps = {
  gymPassUsageId: string;

  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;

  onSuccess?: () => void;
};

export function EndGymSessionDialog({
  gymPassUsageId,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onSuccess,
}: EndGymSessionDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const { mutateAsync, isPending } = useGymEmployeeEndGymSession();

  const handleConfirm = async () => {
    await mutateAsync({ gymPassUsageId });
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" disabled={isPending}>
          <UserCheck className="h-4 w-4" />
          {t("EndSession")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? t("EndGymSessionConfirmTitle")}</DialogTitle>
          <DialogDescription>
            {description ?? t("EndGymSessionConfirmDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              {cancelLabel ?? t("Cancel")}
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t("Working")}
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4 mr-2" />
                {confirmLabel ?? t("Confirm")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
