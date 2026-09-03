import { useCallback, useMemo, useRef, useState } from "react";
import {
  ParsedGymMembershipPassQr,
  parseGymMembershipPassQR,
} from "@lib/gymMembershipPassUtils.ts";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { isGymMembershipPassValid } from "@hooks/gymMembershipPasses/useGymMembershipPasses.ts";
import { GymMembershipPassQRCodeScanningPhase } from "@components/gymMembershipPasses/GymMembershipPassQRCodeScannerDialog.tsx";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useGymEmployeeUseGymMembershipPassForm } from "@hooks/gymMembershipPasses/useGymEmployeeUseGymMembershipPassForm.ts";

type GymMembershipPassQRCodeScannerCameraStatus =
  | "idle"
  | "requesting"
  | "running";

interface GymMembershipPassQRCodeScannerProps {
  phase: GymMembershipPassQRCodeScanningPhase;
  setOpen: (open: boolean) => void;
  setPhase: (phase: GymMembershipPassQRCodeScanningPhase) => void;
}

export const useGymMembershipPassQRCodeScanner = ({
  phase,
  setOpen,
  setPhase,
}: GymMembershipPassQRCodeScannerProps) => {
  const { t } = useTranslation();

  const [parsed, setParsed] = useState<ParsedGymMembershipPassQr | null>(null);
  const { data, errors, setErrors, isLoading, handleChange, onSubmit } =
    useGymEmployeeUseGymMembershipPassForm({
      setOpen,
      gymMembershipPassId: parsed?.gymMembershipPassId,
      userId: parsed?.userId,
    });

  const [cameraStatus, setCameraStatus] =
    useState<GymMembershipPassQRCodeScannerCameraStatus>("idle");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const sessionRef = useRef(0);
  const reader = useMemo(() => new BrowserQRCodeReader(), []);

  const stopScanner = useCallback(() => {
    sessionRef.current += 1;

    controlsRef.current?.stop();
    controlsRef.current = null;

    const video = videoRef.current;
    const stream = video?.srcObject as MediaStream | null;

    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (video) video.srcObject = null;

    setCameraStatus("idle");
  }, []);

  const checkValid = isGymMembershipPassValid();

  const startScanner = useCallback(async () => {
    if (cameraStatus !== "idle") return;

    if (phase !== "scan") return;
    if (!videoRef.current) return;

    stopScanner();

    const mySession = sessionRef.current;

    try {
      setCameraStatus("requesting");

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result, _error, controls) => {
          if (sessionRef.current !== mySession) return;
          if (!result) return;

          controls.stop();
          controlsRef.current = null;
          stopScanner();

          const text = result.getText();
          const parsedQr = parseGymMembershipPassQR(text);

          if (!parsedQr) {
            toast.error(
              t("InvalidQrCode", { defaultValue: "Invalid QR code" }),
            );
            setParsed(null);
            setPhase("scan");
            return;
          }

          setPhase("checking");
          setParsed(parsedQr);

          try {
            const res = await checkValid.mutateAsync({
              gymMembershipPassId: parsedQr.gymMembershipPassId,
            });

            const isValid = true
              ? res
              : Boolean((res as any)?.isValid ?? (res as any)?.valid ?? res);

            if (!isValid) {
              setParsed(null);
              setPhase("scan");
              return;
            }

            setPhase("locker");
          } catch {
            setParsed(null);
            setPhase("scan");
          }
        },
      );

      if (sessionRef.current !== mySession) {
        controls.stop();
        return;
      }

      controlsRef.current = controls;
      setCameraStatus("running");
    } catch (e) {
      setCameraStatus("idle");

      const err = e as DOMException;
      if (
        err?.name === "NotAllowedError" ||
        err?.name === "PermissionDeniedError"
      ) {
        toast.error(t("CameraPermissionDenied"));
      } else if (err?.name === "NotFoundError") {
        toast.error(t("NoCameraOrScannerFound"));
      } else {
        toast.error(
          t("CameraAccessFailed", {
            defaultValue: "Could not access camera",
          }),
        );
      }
    }
  }, [cameraStatus, phase, stopScanner, reader, checkValid, t]);

  const setLockerNumber = (lockerNumber: string) => {
    handleChange("lockerNumber", lockerNumber);
  };

  const handleRescan = () => {
    setLockerNumber("");
    setParsed(null);
    setPhase("scan");
  };

  return {
    startScanner,
    stopScanner,
    videoRef,
    cameraStatus,
    setLockerNumber,
    lockerNumber: data.lockerNumber,
    setParsed,
    parsed,
    isLoading,
    handleRescan,
    errors,
    onSubmit,
    setErrors,
  };
};
