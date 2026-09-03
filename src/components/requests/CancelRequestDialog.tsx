import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog.tsx";
import { Button } from "@ui/button.tsx";
import { useCancelMyRequest } from "@hooks/requests/useHandleRequests.ts";

export function CancelRequestDialog({ requestId }: { requestId: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { mutate: cancelRequest, isPending } = useCancelMyRequest(requestId);

  const handleCancel = () => {
    cancelRequest();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">{t("CancelRequest")}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("CancelRequest")}</DialogTitle>
          <DialogDescription>{t("CancelRequestWarning")}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {t("RequestCancelConfirmation")}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("Back")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending}
          >
            {t("Confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
