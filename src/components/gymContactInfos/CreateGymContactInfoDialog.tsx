import { ReactNode, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { useCreateGymContactInfoForm } from "@hooks/gymContactInfos/useCreateGymContactInfoForm";
import { GymContactInfoInput } from "@components/gymContactInfos/GymContactInfoInput.tsx";

interface CreateGymContactInfoDialogProps {
  trigger?: ReactNode;
  disabled?: boolean;
  disabledToolTip?: ReactNode;
}

export function CreateGymContactInfoDialog({
  trigger,
  disabled,
  disabledToolTip,
}: CreateGymContactInfoDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const {
    data,
    errors,
    isLoading,
    handleChange,
    handleAddressChange,
    handleSubmit,
  } = useCreateGymContactInfoForm(setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            disabledTooltip={disabledToolTip}
            title={t("Create")}
            className="text-muted-foreground"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("CreateContactInfo")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <GymContactInfoInput
            data={data}
            errors={errors}
            handleChange={handleChange}
            handleAddressChange={handleAddressChange}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              {t("Cancel", "Cancel")}
            </Button>

            <Button type="submit" isLoading={isLoading}>
              {t("Save", "Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
