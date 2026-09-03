import { SidebarInset, SidebarProvider, SidebarTrigger } from "@ui/sidebar.tsx";
import { AppSidebar } from "./AppSidebar.tsx";
import { ThemeToggle } from "@ui/themeToggle.tsx";
import { UserMenu } from "./UserMenu.tsx";
import { GymDto } from "@api/types.ts";
import { SearchInput } from "@ui/searchInput.tsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@hooks/user/useAuth.ts";
import { useSearchGyms } from "@hooks/gyms/useGetGyms.ts";
import { CSSProperties } from "react";
import { useClientNotifications } from "@hooks/clientNotifications/useClientNotificationss.ts";
import { roles } from "@constants/roles.ts";
import { GymMembershipPassQRCodeScannerDialog } from "@components/gymMembershipPasses/GymMembershipPassQRCodeScannerDialog.tsx";
import { GymEmployeeRegisterUserDialog } from "@components/users/GymEmployeeRegisterUserDialog.tsx";

export function DashboardLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user, isInRole } = useAuth();

  if (!user) return null;

  const isGymEmployee =
    isInRole(roles.GymAdministrator) || isInRole(roles.GymStaff);

  useClientNotifications(true);

  return (
    <SidebarProvider
      className="h-svh overflow-hidden"
      style={
        {
          "--sidebar-width": "13rem",
          "--sidebar-width-icon": "3.25rem",
        } as CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset className="!min-h-0 h-full flex flex-col overflow-hidden">
        <header className="shrink-0 border-b border-border bg-card">
          <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
            <SidebarTrigger />

            <div className="flex-1 max-w-md">
              <SearchInput<GymDto>
                placeholder={t("SearchGyms")}
                useSearch={useSearchGyms}
                onSelect={(gym) => navigate(`/gyms/${gym.id}`)}
                renderItem={(gym) => (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{gym.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {gym.status}
                    </span>
                  </div>
                )}
              />
            </div>

            <div className="flex items-center gap-4 ml-auto">
              {isGymEmployee && (
                <>
                  <GymEmployeeRegisterUserDialog />
                  <GymMembershipPassQRCodeScannerDialog showLabel />
                </>
              )}
              <UserMenu user={user} />
              <div className="h-6 w-[1px] bg-border" />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
