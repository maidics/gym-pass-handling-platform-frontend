import { useState } from "react";
import { Pencil } from "lucide-react";
import { GymDto, GymTier } from "@api/types.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Button } from "@ui/button";
import { Label } from "@ui/label";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select.tsx";
import { useEditGymProfileForm } from "@hooks/gyms/useUpdateGymForms.ts";
import { useTranslation } from "react-i18next";
import { AddressInput } from "../address/AddressInput.tsx";
import { Separator } from "@ui/separator.tsx";

interface UpdateGymProfileDialogProps {
  gym: GymDto;
}

export function UpdateGymProfileDialog({ gym }: UpdateGymProfileDialogProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const {
    data,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    handleAddressChange,
  } = useEditGymProfileForm(gym, setOpen);

  const gymTiers: GymTier[] = ["Local", "MidRange", "Premium", "Elite"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          {t("Edit")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("EditGymProfile")}</DialogTitle>
          <DialogDescription>
            {t("EditGymProfileDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="name"
              label={t("GymName")}
              required
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier" required>
              {t("Tier")}
            </Label>
            <Select
              value={data.tier}
              onValueChange={(value) => handleChange("tier", value as GymTier)}
            >
              <SelectTrigger>
                <SelectValue placeholder="..." />
              </SelectTrigger>
              <SelectContent>
                {gymTiers.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {t(tier)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <AddressInput
            label="GymAddress"
            address={data.address}
            onChange={handleAddressChange}
            errors={errors.address}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {t("Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
