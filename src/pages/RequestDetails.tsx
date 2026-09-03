import { type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { FileQuestionMark, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Separator } from "@ui/separator";

import { formatDateTime } from "@lib/dateTimeUtils";
import {
  getRequestPriorityVariant,
  getRequestStatusVariant,
} from "@lib/requestUtils";
import {
  showCancelRequestButton,
  showHandleRequestButton,
} from "@lib/permissions";
import { cn } from "@lib/utils";

import { RejectRequestDialog } from "@components/requests/RejectRequestDialog";
import { CancelRequestDialog } from "@components/requests/CancelRequestDialog";
import { ApproveGymCreationRequestDialog } from "@components/requests/ApproveGymCreationRequestDialog";
import { ApproveOtherRequestDialog } from "@components/requests/ApproveOtherRequestDialog";
import { ApproveGymAdminPromotionRequestDialog } from "@components/requests/ApproveGymAdminPromotionRequestDialog";
import { GymCreationPayloadDetailsCard } from "@components/requests/GymCreationPayloadDetailsCard";
import { GymAdminPromotionPayloadDetailsCard } from "@components/requests/GymAdminPromotionPayloadDetailsCard";

import { useAuth } from "@hooks/user/useAuth";
import { useGetRequestById } from "@hooks/requests/useGetRequests";

import { ItemNotFound } from "@ui/itemNotFound";
import { LoadingSkeleton } from "@ui/loadingSkeleton";

import { PageHeader, type PageHeaderItem } from "@components/pages/PageHeader";

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="min-w-0">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm break-words">{value}</div>
    </div>
  );
}

export default function RequestDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { isInRole, user } = useAuth();

  const { request, isLoading } = useGetRequestById(id);

  const userId = user?.id ?? "";
  const showHandleButton = showHandleRequestButton(isInRole, request?.status);
  const showCancelButton = showCancelRequestButton(
    isInRole,
    request?.status,
    userId,
    request?.createdBy,
  );

  if (isLoading) return <LoadingSkeleton />;

  if (!request) {
    return (
      <ItemNotFound
        Icon={FileQuestionMark}
        resourceName="Request"
        backToPageButtonLabel="BackToRequests"
        navigateBackToPagePath="/requests"
      />
    );
  }

  const headerLabels: PageHeaderItem[] = [
    {
      id: "priority",
      node: (
        <Badge
          variant={getRequestPriorityVariant(request.priorityLevel)}
          className="capitalize"
        >
          {t(request.priorityLevel)}
        </Badge>
      ),
    },
    {
      id: "status",
      node: (
        <Badge variant={getRequestStatusVariant(request.status)}>
          {t(request.status)}
        </Badge>
      ),
    },
  ];

  const headerActions: PageHeaderItem[] = [];

  if (showHandleButton) {
    let approveDialog: ReactNode = null;

    if (request.type === "GymCreation") {
      approveDialog = (
        <ApproveGymCreationRequestDialog requestId={request.id} />
      );
    } else if (request.type === "GymAdminPromotion") {
      approveDialog = (
        <ApproveGymAdminPromotionRequestDialog requestId={request.id} />
      );
    } else if (request.type === "Other") {
      approveDialog = <ApproveOtherRequestDialog requestId={request.id} />;
    }

    if (approveDialog) {
      headerActions.push({ id: "approve", index: 0, node: approveDialog });
    }

    headerActions.push({
      id: "reject",
      index: 1,
      node: <RejectRequestDialog requestId={request.id} />,
    });
  }

  if (showCancelButton) {
    headerActions.push({
      id: "cancel",
      index: 2,
      node: <CancelRequestDialog requestId={request.id} />,
    });
  }

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        showBackButton
        title={request.title}
        subtitle={`${t("FieldId", { field: t("Request") })}: ${request.id}`}
        icon={<FileText className="h-6 w-6 text-primary" />}
        labels={headerLabels}
        primaryToolbar={headerActions}
      />

      <div className="grid gap-6 lg:grid-cols-2 items-start min-w-0">
        <Card className="h-full flex flex-col min-w-0">
          <CardHeader>
            <CardTitle>{t("Details")}</CardTitle>
          </CardHeader>

          <Separator className="mb-3" />

          <CardContent className="min-w-0">
            <div className={cn("grid gap-8")}>
              <div className="min-w-0 grid gap-6 sm:grid-cols-2">
                <DetailRow label={t("Type")} value={t(request.type)} />
                <DetailRow
                  label={t("CreatedOn")}
                  value={formatDateTime(request.createdOn)}
                />
                <DetailRow label={t("CreatedBy")} value={request.createdBy} />
                <DetailRow
                  label={t("LastModifiedOn")}
                  value={formatDateTime(request.lastModifiedOn)}
                />
                <DetailRow
                  label={t("LastModifiedBy")}
                  value={request.lastModifiedBy}
                />
                <DetailRow label={t("Error")} value={request.error} />
                <DetailRow
                  label={t("HandlerRationale")}
                  value={request.handlerRationale}
                />
                <DetailRow
                  label={t("Description")}
                  value={request.description}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {request.type === "GymCreation" && (
          <GymCreationPayloadDetailsCard payload={request.payload} />
        )}

        {request.type === "GymAdminPromotion" && (
          <GymAdminPromotionPayloadDetailsCard payload={request.payload} />
        )}
      </div>
    </div>
  );
}
