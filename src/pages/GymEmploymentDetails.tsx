import { useNavigate, useParams } from "react-router-dom";
import {
  User,
  Mail,
  UserCog,
  Globe,
  UserX,
  Building2,
  Mails,
  BadgeCheck,
  Calendar,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useGetGymEmploymentById } from "@hooks/gymEmployments/useGetGymEmployments";
import { useAuth } from "@hooks/user/useAuth";

import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Badge } from "@ui/badge";
import { Separator } from "@components/ui/separator";
import { LoadingSkeleton } from "@ui/loadingSkeleton";
import { ItemNotFound } from "@ui/itemNotFound";

import { PageHeader, type PageHeaderItem } from "@components/pages/PageHeader";
import { DemoteGymStaffAlert } from "@components/gymEmployments/DemoteGymStaffAlert";

import { getGymEmployeeRoleConfig } from "@lib/userUtils";
import { showDemoteGymStaffToPendingGymEmployeeButton } from "@lib/permissions";
import type { Role } from "@constants/roles";
import { FieldEntryInfo } from "@ui/fieldEntryInfo.tsx";
import { Button } from "@ui/button.tsx";
import { formatDateTime } from "@lib/dateTimeUtils.ts";

export default function GymEmploymentDetails() {
  const { employmentId } = useParams<{ employmentId: string }>();
  const { t } = useTranslation();
  const { user, isInRole } = useAuth();
  const navigate = useNavigate();

  const {
    data: employee,
    isLoading,
    error,
  } = useGetGymEmploymentById(employmentId);

  if (isLoading) return <LoadingSkeleton />;

  if (error || !employee) {
    return (
      <ItemNotFound
        backToPageButtonLabel="Employees"
        navigateBackToPagePath={
          user?.gymId ? `/gyms/${user.gymId}/employees` : `/gyms`
        }
        Icon={UserX}
        resourceName="Employee"
      />
    );
  }

  const roleConfig = getGymEmployeeRoleConfig(employee.role as any);

  const initials = `${employee.userProfile.firstName?.[0] ?? ""}${employee.userProfile.lastName?.[0] ?? ""}`;

  const showDemote = showDemoteGymStaffToPendingGymEmployeeButton(
    isInRole,
    user?.gymId,
    employee.role as Role,
    employee.gymId,
  );

  const primary: PageHeaderItem[] = [];

  if (showDemote) {
    primary.push({
      index: 0,
      id: "demote",
      node: (
        <DemoteGymStaffAlert
          userId={employee.userId}
          label={t("Demote")}
          gymId={employee.gymId}
        />
      ),
    });
  }

  const navigation: PageHeaderItem[] = [
    {
      id: "gym-button",
      index: 0,
      node: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/gyms/${employee?.gymId}`)}
          className="gap-2"
        >
          <Building2 className="h-4 w-4" />
          {t("Gym")}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        showBackButton
        title={`${employee.userProfile.firstName} ${employee.userProfile.lastName}`}
        subtitle={employee.userProfile.email}
        icon={
          <span className="text-primary font-bold text-xl">{initials}</span>
        }
        labels={[
          {
            id: "role",
            node: (
              <Badge className={roleConfig.className}>
                {t(roleConfig.label)}
              </Badge>
            ),
          },
        ]}
        primaryToolbar={primary}
        navigationToolbar={navigation}
      />

      <div className="grid gap-6 md:grid-cols-2 min-w-0">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("ProfileInformation")}
            </CardTitle>
          </CardHeader>

          <Separator className="mb-3" />

          <CardContent className="space-y-4 min-w-0">
            <FieldEntryInfo
              icon={User}
              variant="stacked"
              label={t("Name")}
              value={`${employee.userProfile.firstName} ${employee.userProfile.lastName}`}
            />

            <FieldEntryInfo
              icon={Mail}
              variant="stacked"
              label={t("EmailAddress")}
              value={employee.userProfile.email}
            />

            <FieldEntryInfo
              icon={Globe}
              variant="stacked"
              label={t("Language")}
              value={employee.userProfile.preferredLanguage}
            />
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              {t("EmploymentDetails")}
            </CardTitle>
          </CardHeader>

          <Separator className="mb-3" />

          <CardContent className="space-y-4 min-w-0">
            <FieldEntryInfo
              icon={Mails}
              variant="stacked"
              label={t("SupervisorEmail")}
              value={employee.supervisorEmail}
            />

            <FieldEntryInfo
              icon={BadgeCheck}
              variant="stacked"
              label={t("Role")}
              value={t(employee.role)}
            />

            <FieldEntryInfo
              icon={Calendar}
              variant="stacked"
              label={t("JoinedGymOn")}
              value={formatDateTime(employee.createdOn)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
