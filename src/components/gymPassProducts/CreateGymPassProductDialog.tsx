import { useState, ReactNode } from "react";
import { Plus } from "lucide-react";
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
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { PassType } from "@api/types";
import { useCreateGymPassProductForm } from "@hooks/gymPassProducts/useCreateGymPassProductForm";
import { useTranslation } from "react-i18next";
import { MoneyInput } from "@components/money/MoneyInput.tsx";

interface CreateGymPassProductDialogProps {
  trigger?: ReactNode;
  disabled: boolean;
  disabledToolTip?: ReactNode;
}

export function CreateGymPassProductDialog({
  trigger,
  disabled,
  disabledToolTip,
}: CreateGymPassProductDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const {
    data,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    handleMoneyChange,
  } = useCreateGymPassProductForm(setOpen);

  const isSingleUse = data.passType === "SingleUse";

  const passTypes: PassType[] = ["SingleUse", "MultiUse", "Unlimited"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button disabled={disabled} disabledTooltip={disabledToolTip}>
            <Plus className="mr-2 h-4 w-4" />
            {t("CreatePassProduct")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("CreatePassProduct")}</DialogTitle>
          <DialogDescription>
            {t("CreatePassProductDescription")}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="name"
              label={t("Name")}
              required
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t("PassNameExample")}
              error={errors.name}
            />
          </div>

          <div className="space-y-2">
            <Textarea
              id="description"
              label={t("Description")}
              required
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder={t("PassDescriptionPlaceHolder")}
              rows={3}
              error={errors.description}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passType" required>
              {t("Type")}
            </Label>
            <Select
              value={data.passType}
              onValueChange={(x) => handleChange("passType", x as PassType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {passTypes.map((x) => (
                  <SelectItem key={x} value={x}>
                    {t(x)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t(`${data.passType}PassTypeDescription`)}
            </p>
          </div>

          <div className="space-y-2">
            {data.passType !== "Unlimited" ? (
              <Input
                id="totalUses"
                type="number"
                label={t("TotalUses")}
                required
                value={data.totalUses}
                onChange={(e) =>
                  handleChange("totalUses", parseInt(e.target.value, 10) || 0)
                }
                min={isSingleUse ? 1 : 2}
                max={isSingleUse ? 1 : 999}
                disabled={isSingleUse}
              />
            ) : (
              <Input
                id="daysAfterExpires"
                type="number"
                label={t("ValidityPeriodDays")}
                required
                value={data.daysAfterExpires}
                onChange={(e) =>
                  handleChange(
                    "daysAfterExpires",
                    parseInt(e.target.value, 10) || 0,
                  )
                }
                min={1}
                max={365}
              />
            )}

            <p className="text-xs text-muted-foreground">
              {t(
                isSingleUse
                  ? "SingleUsePassTotalUseRule"
                  : data.passType === "MultiUse"
                    ? "MultiUsePassTotalUseRule"
                    : "UnlimitedPassDaysAfterExpiringRule",
              )}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <MoneyInput
                data={data.price}
                isLoading={isLoading}
                onChange={handleMoneyChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">{t("Active")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("PassIsActiveDescription")}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={data.isActive}
              onCheckedChange={(value) =>
                handleChange("isActive", value as boolean)
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {t("Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
