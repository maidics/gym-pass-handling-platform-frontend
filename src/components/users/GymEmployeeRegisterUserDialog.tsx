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
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGymEmployeeRegisterUserForm } from "@hooks/user/useGymEmployeeRegisterUserForm.ts";
import { Input } from "@ui/input.tsx";
import { UserPlus } from "lucide-react";

export function GymEmployeeRegisterUserDialog() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const { data, errors, handleChange, handleSubmit, isLoading, reset } =
    useGymEmployeeRegisterUserForm(setOpen);

  const handleOpenChange = (
    open: boolean,
  ): Dispatch<SetStateAction<boolean>> => {
    setOpen(open);

    if (!open) {
      reset();
    }

    return setOpen;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="h-4 w-4" /> {t("RegisterUser")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("RegisterUser")}</DialogTitle>
          <DialogDescription>{t("RegisterUserDescription")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="email"
              label={t("EmailAddress")}
              required
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={t("EmailExample")}
              className="col-span-3"
              error={errors.email}
            />

            <Input
              id="firstName"
              label={t("FirstName")}
              required
              value={data.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="..."
              className="col-span-3"
              error={errors.firstName}
            />

            <Input
              id="LastName"
              label={t("LastName")}
              required
              value={data.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="..."
              className="col-span-3"
              error={errors.lastName}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            {t("Cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {t("RegisterUser")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
