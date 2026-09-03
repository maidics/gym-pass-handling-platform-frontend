import * as React from "react";
import { useTranslation } from "react-i18next";
import { KeyRound, Lock } from "lucide-react";
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
import { Input } from "@components/ui/input";
import { useUpdateGymPassUsageLockerNumber } from "@hooks/gymPassUsages/useUpdateGymPassUsages";
import { validate } from "@lib/validationUtils.ts";

type UpdateGymPassUsageLockerNumberDialogProps = {
  gymPassUsageId: string;
  currentLockerNumber?: string | null;

  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
};

export function UpdateGymPassUsageLockerNumberDialog({
  gymPassUsageId,
  currentLockerNumber,

  title,
  description,
  confirmLabel,
  cancelLabel,
}: UpdateGymPassUsageLockerNumberDialogProps) {
  const { t } = useTranslation();
  const { isEmpty } = validate();

  const [open, setOpen] = React.useState(false);

  const [lockerNumber, setLockerNumber] = React.useState(
    currentLockerNumber ?? "",
  );

  const { mutateAsync, isPending } = useUpdateGymPassUsageLockerNumber();

  const buttonDisabled =
    isEmpty(lockerNumber) || lockerNumber === currentLockerNumber || isPending;

  const handleConfirm = async () => {
    if (buttonDisabled) return;

    await mutateAsync({ gymPassUsageId, lockerNumber: lockerNumber.trim() });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" disabled={isPending}>
          <Lock className="h-4 w-4 mr-2" />
          {t("UpdateLockerNumber")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title ?? t("UpdateLockerNumberConfirmTitle")}
          </DialogTitle>

          <DialogDescription>
            {description ?? t("UpdateLockerNumberConfirmDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("LockerNumber")}</label>
          <Input
            value={lockerNumber}
            onChange={(e) => setLockerNumber(e.target.value)}
            disabled={isPending}
            placeholder={t("LockerNumber")}
            inputMode="numeric"
            error={isEmpty(lockerNumber)}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              {cancelLabel ?? t("Cancel")}
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={buttonDisabled}
          >
            <KeyRound className="h-4 w-4 mr-2" />
            {confirmLabel ?? t("Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
