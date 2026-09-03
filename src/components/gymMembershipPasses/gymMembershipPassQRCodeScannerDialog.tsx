import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ScanQrCode } from "lucide-react";
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
import { useGymMembershipPassQRCodeScanner } from "@hooks/gymMembershipPasses/useGymMembershipPassQRCodeScanner.ts";
import { Separator } from "@ui/separator.tsx";
import { Input } from "@ui/input.tsx";

export type GymMembershipPassQRCodeScanningPhase =
  | "scan"
  | "checking"
  | "locker";

interface GymMembershipPassQRCodeScannerDialogProps {
  trigger?: React.ReactNode;
  disabled?: boolean;
  disabledToolTip?: React.ReactNode;
  showLabel?: boolean;
}

export function GymMembershipPassQRCodeScannerDialog({
  trigger,
  disabled,
  disabledToolTip,
  showLabel,
}: GymMembershipPassQRCodeScannerDialogProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [phase, setPhase] =
    useState<GymMembershipPassQRCodeScanningPhase>("scan");

  const {
    startScanner,
    stopScanner,
    videoRef,
    setParsed,
    parsed,
    isLoading,
    setLockerNumber,
    lockerNumber,
    handleRescan,
    errors,
    onSubmit,
    setErrors,
  } = useGymMembershipPassQRCodeScanner({
    phase,
    setOpen,
    setPhase,
  });

  const [scanCooldownMsLeft, setScanCooldownMsLeft] = useState(0);
  const cooldownTimeoutRef = useRef<number | null>(null);
  const cooldownIntervalRef = useRef<number | null>(null);

  const clearCooldownTimers = () => {
    if (cooldownTimeoutRef.current) {
      window.clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = null;
    }
    if (cooldownIntervalRef.current) {
      window.clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = null;
    }
    setScanCooldownMsLeft(0);
  };

  useEffect(() => {
    if (!open) {
      clearCooldownTimers();
      stopScanner();
      setPhase("scan");
      setParsed(null);
      setLockerNumber("");
      setErrors({});
    }
  }, [open, stopScanner]);

  useEffect(() => {
    if (!open) return;
    if (phase !== "scan") stopScanner();
  }, [open, phase, stopScanner]);

  const prevOpenRef = useRef(open);
  const prevPhaseRef = useRef(phase);

  useEffect(() => {
    const prevOpen = prevOpenRef.current;
    const prevPhase = prevPhaseRef.current;

    prevOpenRef.current = open;
    prevPhaseRef.current = phase;

    if (!open) return;

    const openedNow = !prevOpen && open;
    const enteredScanNow = prevPhase !== "scan" && phase === "scan";

    if (phase === "scan" && (openedNow || enteredScanNow)) {
      clearCooldownTimers();

      const delayMs = prevPhase === "checking" ? 2000 : 0;

      if (delayMs === 0) {
        const id = requestAnimationFrame(() => startScanner());
        return () => cancelAnimationFrame(id);
      }

      const endAt = Date.now() + delayMs;
      setScanCooldownMsLeft(delayMs);

      cooldownIntervalRef.current = window.setInterval(() => {
        const left = Math.max(0, endAt - Date.now());
        setScanCooldownMsLeft(left);

        if (left === 0) {
          if (cooldownIntervalRef.current) {
            window.clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
          }
        }
      }, 100);

      cooldownTimeoutRef.current = window.setTimeout(() => {
        setScanCooldownMsLeft(0);
        requestAnimationFrame(() => startScanner());
      }, delayMs);
    }
  }, [open, phase, startScanner]);

  const cooldownSeconds = Math.ceil(scanCooldownMsLeft / 1000);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="secondary"
            disabled={disabled}
            disabledTooltip={disabledToolTip}
            type="button"
          >
            <ScanQrCode className={`${showLabel && "mr-2"} h-4 w-4`} />
            {showLabel && t("ScanQRCode")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("ScanPassQRCode")}</DialogTitle>
          <DialogDescription>
            {phase === "scan" && t("AllowCameraDescription")}
            {phase === "checking" && t("CheckingPass")}
            {phase === "locker" && t("EnterLockerNumber")}
          </DialogDescription>
        </DialogHeader>

        {phase === "scan" && (
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-lg border bg-black">
              <video
                ref={videoRef}
                className="h-[360px] w-full object-cover"
                muted
                playsInline
              />

              {scanCooldownMsLeft > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="rounded-md bg-black/60 px-3 py-2 text-sm text-white">
                    {t("RetryingScanIn", {
                      seconds: cooldownSeconds,
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {t("ScanQRTip")}
            </div>
          </div>
        )}

        <Separator />

        {phase === "checking" && (
          <div className="py-6 text-sm text-muted-foreground">
            {t("PleaseWait")}
          </div>
        )}

        {phase === "locker" && parsed && (
          <div className="space-y-3">
            <form noValidate>
              <div className="mb-5 flex items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground">
                <span>{t("ValidPass")}</span>
                <Check className="h-4 w-4 text-green-600" />
              </div>

              <label className="block text-sm font-medium">
                {t("LockerNumber")}
              </label>
              <Input
                value={lockerNumber}
                onChange={(e) => setLockerNumber(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder={t("LockerNumberPlaceholder")}
                error={errors.lockerNumber}
              />
            </form>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            {t("Cancel", { defaultValue: "Close" })}
          </Button>

          {phase === "locker" && (
            <>
              <Button
                type="button"
                className="rounded-md border px-3 py-2 text-sm"
                onClick={handleRescan}
                disabled={isLoading}
                variant="secondary"
              >
                {t("Rescan")}
              </Button>

              <Button
                type="submit"
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
                onClick={onSubmit}
                disabled={isLoading}
              >
                {t("Confirm")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
