import { useState } from "react";
import { Wrench, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { usePromotePendingGymEmployeeToGymStaffForm } from "@hooks/gymContactInfos/usePromotePendingGymEmployeeToGymStaffForm.ts";

export function PromotePendingGymEmployeeToGymStaffDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data, errors, handleChange, handleSubmit, isLoading, reset } =
    usePromotePendingGymEmployeeToGymStaffForm(setOpen);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Wrench className="h-4 w-4 mr-2" />
          {t("AddGymStaff")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Promotion")}</DialogTitle>
          <DialogDescription>
            {t("PromoteToGymStaffDescription")}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              label={t("EmailAddress")}
              startIcon={<Mail className="h-4 w-4" />}
              id="pendingGymEmployeeEmail"
              type="email"
              placeholder={t("PendingGymEmployeeEmailExample")}
              required
              value={data.pendingGymEmployeeEmail}
              onChange={(e) =>
                handleChange("pendingGymEmployeeEmail", e.target.value)
              }
              error={errors.pendingGymEmployeeEmail}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("Cancel")}
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {t("Promote")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
