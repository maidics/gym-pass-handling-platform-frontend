import { useState } from "react";
import { Activity } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Button } from "@ui/button";
import { Label } from "@ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import {
  GymDto,
  GymStatus,
  UpdateGymStatusCommand,
  UpdateMyGymStatusCommand,
} from "@api/types.ts";
import { Textarea } from "@ui/textArea.tsx";
import { useTranslation } from "react-i18next";
import {
  useUpdateGymStatus,
  useUpdateMyGymStatus,
} from "@hooks/gyms/useUpdateGyms.ts";
import { useAuth } from "@hooks/user/useAuth.ts";
import { roles } from "@constants/roles.ts";

interface UpdateGymStatusDialogProps {
  gym: GymDto;
}

export function UpdateGymStatusDialog({ gym }: UpdateGymStatusDialogProps) {
  const { t } = useTranslation();
  const { isInRole } = useAuth();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<GymStatus>(gym.status);
  const [rationale, setRationale] = useState("");

  const updateMyGymStatus = useUpdateMyGymStatus();
  const updateGymStatus = useUpdateGymStatus();

  const isAppAdmin = isInRole(roles.AppAdministrator);

  const availableStatuses: GymStatus[] = isAppAdmin
    ? ["Active", "Inactive", "Suspended"]
    : ["Active", "Inactive"];

  const handleSubmit = async () => {
    try {
      if (isAppAdmin) {
        const command: UpdateGymStatusCommand = {
          gymId: gym.id,
          newGymStatus: status,
          rationale: rationale,
        };

        await updateGymStatus.mutateAsync(command);
      } else {
        const command: UpdateMyGymStatusCommand = {
          newGymStatus: status,
        };

        await updateMyGymStatus.mutateAsync(command);
      }
      setOpen(false);
      setRationale("");
    } catch (error) {}
  };

  const isPending = updateMyGymStatus.isPending || updateGymStatus.isPending;

  const isStatusUnchanged = status === gym.status;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-2" />
          {t("UpdateStatus")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("UpdateGymStatus")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("CurrentStatus")}</Label>
            <p
              id="currentStatus"
              className="text-sm text-muted-foreground mt-1"
            >
              {t(gym.status)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="block mb-3" required>
              {t("NewStatus")}
            </Label>
            <Select
              value={status}
              onValueChange={(v: GymStatus) => setStatus(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((x) => (
                  <SelectItem key={x} value={x}>
                    {t(x)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAppAdmin && (
            <div className="space-y-2">
              <Label htmlFor="rationale">{t("Rationale")}</Label>
              <Textarea
                id="rationale"
                placeholder={t("GymStatusChangeRationaleDescription")}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isPending ||
              (isAppAdmin && !rationale.trim()) ||
              isStatusUnchanged
            }
          >
            {t("UpdateStatus")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
