import { useTranslation } from "react-i18next";
import { GymStatus, GymTier, PriorityLevel, RequestType } from "@api/types.ts";
import { roles } from "@constants/roles.ts";
import { useAuth } from "@hooks/user/useAuth.ts";
import { useCreateRequestForm } from "@hooks/requests/useCreateRequestForm.ts";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Separator } from "../ui/separator.tsx";
import { maxLength } from "@constants/maxLength.ts";
import { Checkbox } from "../ui/checkbox.tsx";
import { AddressInput } from "../address/AddressInput.tsx";
import { Plus } from "lucide-react";

export function CreateRequestDialog() {
  const { t } = useTranslation();
  const { isInRole, user } = useAuth();

  const [open, setOpen] = useState(false);

  const canCreateGym = isInRole(roles.PendingGymEmployee);
  const canCreatePromotion = isInRole(roles.GymAdministrator);

  const {
    data,
    errors,
    handleSubmit,
    handleGymCreationAddressChange,
    handleChange,
    isLoading,
    handleUseMyEmailAsSuperVisorChange,
  } = useCreateRequestForm(setOpen);

  const disabled = !user!.isEmailConfirmed;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="w-full sm:w-auto"
          disabled={disabled}
          disabledTooltip={t("ConfirmEmailForAction")}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("CreateRequest")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("CreateRequest")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 py-4">
            <div className="space-y-2 mb-3">
              <Label htmlFor="type" required className="block text-sm">
                {t("RequestType")}
              </Label>
              <Select
                value={data.requestType}
                onValueChange={(x) =>
                  handleChange("requestType", x as RequestType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("SelectType")} />
                </SelectTrigger>
                <SelectContent>
                  {canCreateGym && (
                    <SelectItem value="GymCreation">
                      {t("GymCreation")}
                    </SelectItem>
                  )}
                  {canCreatePromotion && (
                    <SelectItem value="GymAdminPromotion">
                      {t("GymAdminPromotion")}
                    </SelectItem>
                  )}
                  <SelectItem value="Other">{t("Other")}</SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="priorityLevel" required className="block">
                {t("Priority")}
              </Label>
              <Select
                value={data.priorityLevel}
                onValueChange={(x) =>
                  handleChange("priorityLevel", x as PriorityLevel)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">{t("None")}</SelectItem>
                  <SelectItem value="Low">{t("Low")}</SelectItem>
                  <SelectItem value="Medium">{t("Medium")}</SelectItem>
                  <SelectItem value="High">{t("High")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative mb-6">
              <Input
                id="title"
                label={t("Title")}
                required
                value={data.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={errors.title}
              />
            </div>

            <div className="relative mb-6">
              <Textarea
                id="description"
                label={t("RequestDescription")}
                required
                placeholder={t("DescriptionFieldDescription", {
                  field: maxLength.Description,
                })}
                value={data.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                error={errors.description}
              />
            </div>

            {data.requestType === "GymCreation" && canCreateGym && (
              <>
                <div className="relative">
                  <Input
                    id="gymName"
                    label={t("GymName")}
                    required
                    placeholder={t("GymNameDescription")}
                    value={data.gymName}
                    onChange={(e) => handleChange("gymName", e.target.value)}
                    error={errors.gymName}
                  />
                </div>

                <Separator className="my-2" />

                <AddressInput
                  label={"GymAddress" as "translation"}
                  address={data.gymAddress!}
                  onChange={handleGymCreationAddressChange}
                  errors={errors.gymAddress}
                />

                <Separator className="my-2" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gymStatus" required className="block">
                      {t("Status")}
                    </Label>
                    <Select
                      value={data.gymStatus}
                      onValueChange={(x) =>
                        handleChange("gymStatus", x as GymStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">{t("Active")}</SelectItem>
                        <SelectItem value="Inactive">
                          {t("Inactive")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gymTier" required className="block">
                      {t("GymTier")}
                    </Label>
                    <Select
                      value={data.gymTier}
                      onValueChange={(x) =>
                        handleChange("gymTier", x as GymTier)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Local">{t("Local")}</SelectItem>
                        <SelectItem value="MidRange">
                          {t("MidRange")}
                        </SelectItem>
                        <SelectItem value="Premium">{t("Premium")}</SelectItem>
                        <SelectItem value="Elite">{t("Elite")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="relative mb-3">
                  <Input
                    id="supervisorEmail"
                    label={t("SupervisorEmail")}
                    required
                    type="email"
                    placeholder={t("EmailExample")}
                    value={data.gymSupervisorEmail}
                    disabled={data.useMyEmailAsSuperVisor}
                    onChange={(e) =>
                      handleChange("gymSupervisorEmail", e.target.value)
                    }
                    error={errors.gymSupervisorEmail}
                  />
                </div>
              </>
            )}

            {data.requestType === "GymAdminPromotion" && canCreatePromotion && (
              <>
                <div className="relative mb-6">
                  <Input
                    id="userId"
                    label={t("PendingGymEmployeeEmail")}
                    required
                    placeholder={t("PendingGymEmployeeEmailExample")}
                    value={data.promotionPendingGymEmployeeEmail}
                    onChange={(e) =>
                      handleChange(
                        "promotionPendingGymEmployeeEmail",
                        e.target.value,
                      )
                    }
                    error={errors.promotionPendingGymEmployeeEmail}
                  />
                </div>

                <div className="relative mb-4">
                  <Input
                    id="supervisorEmail"
                    label={t("SupervisorEmail")}
                    placeholder={t("EmailExample")}
                    required
                    type="email"
                    value={data.promotionSuperVisorEmail}
                    disabled={data.useMyEmailAsSuperVisor}
                    onChange={(e) =>
                      handleChange("promotionSuperVisorEmail", e.target.value)
                    }
                    error={errors.promotionSuperVisorEmail}
                  />
                </div>
              </>
            )}

            {(data.requestType === "GymCreation" ||
              data.requestType === "GymAdminPromotion") && (
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="useMyEmail"
                  checked={data.useMyEmailAsSuperVisor}
                  onCheckedChange={(checked) =>
                    handleUseMyEmailAsSuperVisorChange(
                      checked as boolean,
                      data.requestType === "GymCreation"
                        ? "gymSupervisorEmail"
                        : "promotionSuperVisorEmail",
                    )
                  }
                />
                <Label
                  htmlFor="useMyEmail"
                  className="text-sm text-muted-foreground font-normal cursor-pointer"
                >
                  {t("UseMyEmailIfNoSupervisor")}
                </Label>
              </div>
            )}
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
            <Button type="submit" disabled={isLoading}>
              {t("CreateRequest")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
