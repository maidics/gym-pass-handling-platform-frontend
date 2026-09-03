import { ReactNode, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GymContactInfoDto } from "@api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { useUpdateGymContactInfoForm } from "@hooks/gymContactInfos/useUpdateGymContactInfoForm";
import { GymContactInfoInput } from "@components/gymContactInfos/GymContactInfoInput.tsx";

interface UpdateGymContactInfoDialogProps {
  contact: GymContactInfoDto;
  trigger?: ReactNode;
  disabled?: boolean;
  disabledToolTip?: ReactNode;
}

export function UpdateGymContactInfoDialog({
  contact,
  trigger,
  disabled,
  disabledToolTip,
}: UpdateGymContactInfoDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const {
    data,
    errors,
    isLoading,
    handleChange,
    handleAddressChange,
    handleSubmit,
    resetForm,
  } = useUpdateGymContactInfoForm(contact, setOpen);

  useEffect(() => {
    if (!open) resetForm();
  }, [open, resetForm]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            disabledTooltip={disabledToolTip}
            title={t("Edit")}
            className="text-white/85"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("UpdateGymContactInfo", "Update contact")}
          </DialogTitle>
          <DialogDescription className="text-justify">
            {t(
              "UpdateGymContactInfoDescription",
              "Update this contact’s details.",
            )}
          </DialogDescription>
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
