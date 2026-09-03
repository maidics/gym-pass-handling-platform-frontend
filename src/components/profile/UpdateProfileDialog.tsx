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
import { Label } from "@ui/label.tsx";
import { Input } from "@ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select.tsx";
import { Button } from "@ui/button.tsx";
import { useTranslation } from "react-i18next";
import { useUpdateProfileForm } from "@hooks/profile/useUpdateProfileForm.ts";
import { languageMap } from "@constants/languages.ts";

export function UpdateProfileDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const languages = Object.values(languageMap);

  const { data, errors, isLoading, handleChange, handleSubmit } =
    useUpdateProfileForm(setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          {t("EditProfile")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("EditProfile")}</DialogTitle>
          <DialogDescription>{t("EditProfileDescription")}</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Input
                id="firstName"
                label={t("FirstName")}
                required
                value={data.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={errors.firstName}
              />
              <Input
                id="lastName"
                label={t("LastName")}
                required
                value={data.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                error={errors.lastName}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="language" required>
                {t("DisplayLanguage")}
              </Label>
              <Select
                value={data.preferredLanguage}
                onValueChange={(x) => handleChange("preferredLanguage", x)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("SelectLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {t("Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
