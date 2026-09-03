import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@ui/textArea.tsx";
import { GymPassProductDto } from "@api/types.ts";
import { useUpdateGymPassProductForm } from "@hooks/gymPassProducts/useUpdateGymPassProductForm.ts";
import { PencilLine } from "lucide-react";
import { useState } from "react";
import { MoneyInput } from "@components/money/MoneyInput.tsx";

type UpdateGymPassProductDialogProps = {
  gymPassProduct: GymPassProductDto;
  showLabel?: boolean;
};

export function UpdateGymPassProductDialog({
  gymPassProduct,
  showLabel,
}: UpdateGymPassProductDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data, errors, handleMoneyChange, handleChange, onSubmit, isLoading } =
    useUpdateGymPassProductForm(gymPassProduct, setOpen);

  const isUnlimited = gymPassProduct.type === "Unlimited";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-primary"
        >
          <PencilLine />
          {showLabel && t("UpdatePass")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("UpdateGymPassProductTitle")}</DialogTitle>
        </DialogHeader>

        <form noValidate onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Input
              id="gpp-name"
              label={t("Name")}
              required
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              autoComplete="off"
              disabled={isLoading}
              error={errors.name}
            />
          </div>

          <div className="grid gap-2">
            <Textarea
              label={t("Description")}
              required
              id="gpp-description"
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              disabled={isLoading}
              error={errors.description}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
            {isUnlimited ? (
              <div className="grid gap-2">
                <Input
                  id="gpp-daysAfterExpiring"
                  type="number"
                  label={t("DaysAfterExpiring")}
                  required
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={data.daysAfterExpires}
                  onChange={(e) =>
                    handleChange(
                      "daysAfterExpiring",
                      isUnlimited ? Number(e.target.value) : undefined,
                    )
                  }
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Input
                  id="gpp-totalUses"
                  type="number"
                  label={t("TotalUses")}
                  required
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={data.totalUses}
                  onChange={(e) =>
                    !isUnlimited ? Number(e.target.value) : undefined
                  }
                  disabled={isLoading || gymPassProduct.type === "SingleUse"}
                />
              </div>
            )}

            <div className="grid gap-2">
              <MoneyInput
                data={data.price}
                errors={errors.price}
                isLoading={isLoading}
                onChange={handleMoneyChange}
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                {t("Cancel")}
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isLoading}>
              {t("Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
