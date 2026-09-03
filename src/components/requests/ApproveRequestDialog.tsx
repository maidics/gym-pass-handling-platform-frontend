import { useState, ReactNode } from "react";
import { Check, LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Button } from "@ui/button";
import { useTranslation } from "react-i18next";

type ConfirmRequestDialogProps = {
  triggerLabel?: ReactNode;
  TriggerIcon?: LucideIcon;
  HeaderIcon: LucideIcon;
  title?: ReactNode;
  description: ReactNode;
  notice?: ReactNode;
  cancelLabel?: ReactNode;
  approveLabel?: ReactNode;
  loadingLabel?: ReactNode;
  isPending: boolean;
  approveFn: () => Promise<void>;
  contentClassName?: string;
};

export function ApproveRequestDialog({
  triggerLabel,
  TriggerIcon,
  HeaderIcon,
  title,
  description,
  notice,
  cancelLabel,
  approveLabel,
  loadingLabel,
  isPending,
  approveFn,
  contentClassName = "sm:max-w-[425px]",
}: ConfirmRequestDialogProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const Icon = TriggerIcon ?? Check;

  const handleConfirm = async () => {
    await approveFn();

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon className="mr-2 h-4 w-4" />
          {triggerLabel ?? t("Approve")}
        </Button>
      </DialogTrigger>

      <DialogContent className={contentClassName}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white rounded-full">
              <HeaderIcon className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle>{title ?? t("ApproveRequestTitle")}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>

        {notice && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">{notice}</p>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {cancelLabel ?? t("Cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending
              ? (loadingLabel ?? t("ApprovePending"))
              : (approveLabel ?? t("Approve"))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
