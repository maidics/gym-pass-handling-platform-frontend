import { useState, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Trash2 } from "lucide-react";
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
import { Button, buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import { useDeleteGymContactInfo } from "@hooks/gymContactInfos/useGymContactInfos.ts";

interface DeleteGymContactInfoDialogProps {
  gymContactInfoId: string;
}

export function DeleteGymContactInfoDialog({
  gymContactInfoId,
}: DeleteGymContactInfoDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { mutate, isPending, reset } = useDeleteGymContactInfo();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset();
    setOpen(isOpen);
  };

  const onDelete = (e: MouseEvent) => {
    e.preventDefault();

    mutate(
      { gymContactInfoId },
      {
        onSuccess: () => {
          handleOpenChange(false);
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          title={t("Delete")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {t("DeleteGymContactInfo")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("DeleteGymContactInfoDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("Cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onDelete}
            disabled={isPending}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
