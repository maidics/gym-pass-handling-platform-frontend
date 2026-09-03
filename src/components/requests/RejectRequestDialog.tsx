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
import { Textarea } from "@ui/textArea.tsx";
import { useRejectRequest } from "@hooks/requests/useHandleRequests.ts";
import { validate } from "@lib/validationUtils.ts";

export function RejectRequestDialog({ requestId }: { requestId: string }) {
  const { t } = useTranslation();
  const { isEmpty } = validate();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [rationale, setRationale] = useState("");
  const { mutate: rejectRequest, isPending } = useRejectRequest(requestId);

  const handleReject = () => {
    if (isEmpty(rationale)) {
      setError(" ");
      return;
    }

    rejectRequest(rationale);
    setError("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">{t("Reject")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("RejectRequest")}</DialogTitle>
          <DialogDescription>{t("RejectRequestDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              id="rationale"
              label={t("Rationale")}
              required
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder={t("RejectRequestRationalePlaceholder")}
              className="col-span-3"
              error={error}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("Cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isPending}
          >
            {isPending ? t("Processing") : t("ConfirmRejection")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
