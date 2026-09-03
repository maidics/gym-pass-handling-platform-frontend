import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog.tsx";
import { Input } from "@ui/input.tsx";
import { Button } from "@ui/button.tsx";
import { useTranslation } from "react-i18next";
import { useUpdateMyPasswordForm } from "@hooks/user/useUpdateMyPasswordForm.ts";

export function UpdatePasswordDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data, errors, isLoading, handleChange, handleSubmit } =
    useUpdateMyPasswordForm(setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          {t("ChangePassword")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("ChangePassword")}</DialogTitle>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="relative">
                <Input
                  id="currentPassword"
                  type="password"
                  value={data.currentPassword}
                  onChange={(e) =>
                    handleChange("currentPassword", e.target.value)
                  }
                  label={t("CurrentPassword")}
                  required
                  error={errors.currentPassword}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="relative">
                <Input
                  id="newPassword"
                  type="password"
                  value={data.newPassword}
                  onChange={(e) => handleChange("newPassword", e.target.value)}
                  label={t("NewPassword")}
                  required
                  error={errors.newPassword}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={data.newPasswordConfirm}
                  onChange={(e) =>
                    handleChange("newPasswordConfirm", e.target.value)
                  }
                  label={t("NewPasswordConfirm")}
                  required
                  error={errors.newPasswordConfirm}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              {t("Cancel")}
            </Button>

            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              {t("UpdatePassword")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
