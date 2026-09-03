import { Building2, Users } from "lucide-react";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GymDto } from "@api/types";
import { getGymStatusConfig, getGymTierConfig } from "@lib/gymUtils";
import { UpdateGymProfileDialog } from "./UpdateGymProfileDialog";
import { UpdateGymStatusDialog } from "./UpdateGymStatusDialog";
import { useAuth } from "@hooks/user/useAuth";
import { PageHeader, PageHeaderItem } from "@components/pages/PageHeader.tsx";
import {
  showEmployeesButton,
  showUpdateGymProfileButton,
  showUpdateGymStatusButton,
} from "@lib/permissions.ts";
import { roles } from "@constants/roles.ts";

interface GymHeaderProps {
  gym: GymDto;
}

export function GymDetailsHeader({ gym }: GymHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isInRole, isManagedGym } = useAuth();

  const statusConfig = getGymStatusConfig(gym.status);
  const tierConfig = getGymTierConfig(gym.tier);

  const labels: PageHeaderItem[] = [
    {
      id: "status",
      index: 0,
      node: (
        <Badge variant="outline" className={statusConfig.className}>
          {t(gym.status)}
        </Badge>
      ),
    },
    {
      id: "tier",
      index: 1,
      node: (
        <Badge variant="outline" className={tierConfig.className}>
          {t(gym.tier)}
        </Badge>
      ),
    },
  ];

  const actions: PageHeaderItem[] = [];

  showUpdateGymProfileButton(isInRole, isManagedGym, gym.id) &&
    actions.push({
      id: "edit-profile",
      index: 10,
      node: <UpdateGymProfileDialog gym={gym} />,
    });

  showUpdateGymStatusButton(isInRole, isManagedGym, gym.id) &&
    actions.push({
      id: "update-status",
      index: 20,
      node: <UpdateGymStatusDialog gym={gym} />,
    });

  const navigation: PageHeaderItem[] = [];

  showEmployeesButton(isManagedGym, gym.id) &&
    navigation.push({
      id: "employees",
      index: 0,
      node: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/gyms/${gym.id}/employees`)}
        >
          <Users className="mr-2 h-4 w-4" />
          {t("Employees")}
        </Button>
      ),
    });

  return (
    <PageHeader
      title={gym.name}
      icon={<Building2 className="h-6 w-6 text-primary" />}
      subtitle={
        isInRole(roles.AppAdministrator) ? (
          <span className="font-mono">
            {t("Id")}: {gym.id}
          </span>
        ) : undefined
      }
      showBackButton
      labels={labels}
      primaryToolbar={actions}
      navigationToolbar={navigation}
    />
  );
}
