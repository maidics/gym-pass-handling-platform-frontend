import { useState } from "react";
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
} from "@ui/alert-dialog";
import { buttonVariants, Button } from "@ui/button";
import { useTranslation } from "react-i18next";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@lib/utils.ts";
import { useDeleteMyAccountForm } from "@hooks/user/useDeleteAccountForm.ts";
import { Input } from "@ui/input.tsx";

export function DeleteAccountDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const {
    confirmation,
    setConfirmation,
    isConfirmed,
    isLoading,
    handleSubmit,
    userEmail,
  } = useDeleteMyAccountForm();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="shrink-0"
          title={t("DeleteAccount", "Delete Account")}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">
            {t("DeleteAccount", "Delete Account")}
          </span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {t("DeleteAccount")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("DeleteAccountWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-3 py-2">
          <p className="text-sm font-normal">{t("TypeEmailToConfirm")}</p>

          <Input
            id="confirm-email"
            value={confirmation}
            placeholder={userEmail}
            label={t("Confirmation")}
            required
            onChange={(e) => setConfirmation(e.target.value)}
            autoComplete="off"
            onPaste={(e) => e.preventDefault()}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("Cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleSubmit}
            disabled={isLoading || !isConfirmed}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("ConfirmDeleteAccount")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
