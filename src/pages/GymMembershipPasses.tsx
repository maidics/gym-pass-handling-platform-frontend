import { useState } from "react";
import { TicketX, X, Ticket, TicketPlus } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type { PassType } from "@api/types";
import { useAuth } from "@hooks/user/useAuth";
import { useGetMyGymMembershipPasses } from "@hooks/gymMembershipPasses/useGetGymMembershipPasses";

import { PageHeader } from "@components/pages/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@components/ui/dialog";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { GymMembershipPassCard } from "@components/gymMembershipPasses/GymMembershipPassCard";
import { LoadingSkeleton } from "@ui/loadingSkeleton";
import { NoItemFound } from "@ui/noItemFound";

export default function GymMembershipPasses() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: passes, isLoading } = useGetMyGymMembershipPasses();

  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedPassId, setSelectedPassId] = useState<string | null>(null);
  const [selectedPassType, setSelectedPassType] = useState<PassType | null>(
    null,
  );

  const handleShowQR = ({ id, type }: { id: string; type: PassType }) => {
    setSelectedPassId(id);
    setSelectedPassType(type);
    setQrDialogOpen(true);
  };

  const headerMeta =
    !isLoading && passes && passes.length > 0
      ? t("ShowingResults", { count: passes.length })
      : null;

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        showBackButton
        icon={<Ticket className="h-6 w-6 text-primary" />}
        title={t("MyPasses")}
        subtitle={t("ViewAndManagePassesDescription")}
        metaDisplay={headerMeta}
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : passes && passes.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center min-w-0">
          <NoItemFound
            Icon={TicketX}
            titleKey="NoPassesToShow"
            descriptionKey="YouHaventPurchasedAnyPasses"
          >
            <Button
              variant="default"
              onClick={() => navigate("/gyms")}
              className="mt-4 gap-2"
            >
              <TicketPlus className="h-4 w-4" />
              {t("ChooseAGymAndPurchaseAPassHere")}
            </Button>
          </NoItemFound>
        </div>
      ) : (
        <div className="space-y-4 min-w-0">
          {passes?.map((pass) => (
            <GymMembershipPassCard
              key={pass.id}
              pass={pass}
              onShowQR={handleShowQR}
            />
          ))}
        </div>
      )}

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {`${selectedPassType === "SingleUse" ? t("Ticket") : t("Pass")} ${t("QRCode")}`}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t("PassQRCodeDescription")}
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t("Close")}</span>
            </Button>
          </DialogClose>

          <Separator />

          <div className="flex flex-col items-center justify-center py-6 min-w-0">
            {selectedPassId && user?.id && (
              <div className="w-full flex justify-center px-2 min-w-0">
                <div className="bg-white p-4 rounded-lg w-full max-w-[min(320px,100%)]">
                  <QRCodeSVG
                    value={`${selectedPassId}_${user.id}`}
                    size={320}
                    level="H"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
