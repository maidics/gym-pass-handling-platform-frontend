import {
  FileText,
  User,
  LogOut,
  Building2,
  Dumbbell,
  Users,
  Ticket,
  LucideIcon,
  TicketPlus,
  ChevronRight,
  CreditCard,
  IdCardLanyard,
  NotepadText,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@ui/sidebar.tsx";
import { NavLink } from "../navlink.tsx";
import { constants } from "@constants/constants.ts";
import { roles } from "@constants/roles.ts";
import { useTranslation } from "react-i18next";
import { useAuth } from "@hooks/user/useAuth.ts";
import AppLogo from "@ui/appLogo.tsx";
import { useState } from "react";
import { cn } from "@lib/utils.ts";
import { useGetGymById } from "@hooks/gyms/useGetGyms.ts";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  children?: NavItem[];
}
export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { logout, isInRole } = useAuth();
  const { t } = useTranslation();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    MyGym: true,
  });

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const gymsTitle =
    isInRole(roles.GymAdministrator) || isInRole(roles.GymStaff)
      ? "ExploreGyms"
      : "Gyms";

  const navItems: NavItem[] = [
    { title: gymsTitle, url: "/Gyms", icon: Dumbbell },
    { title: "Requests", url: "/requests", icon: FileText },
    { title: "Profile", url: "/profile", icon: User },
  ];

  if (isInRole(roles.GymAdministrator) || isInRole(roles.GymStaff)) {
    const { user } = useAuth();

    let hasPaymentProfile;

    if (isInRole(roles.GymAdministrator)) {
      const { gym } = useGetGymById(user!.gymId);

      hasPaymentProfile = !!gym?.paymentProfile;
    }

    navItems.splice(0, 0, {
      title: "MyGym",
      url: `/gyms/${user!.gymId}`,
      icon: Building2,
      children: [
        {
          title: "Members",
          url: `/gym-members`,
          icon: IdCardLanyard,
        },
        {
          title: "Passes",
          url: `/gyms/${user!.gymId!}/pass-products`,
          icon: TicketPlus,
        },
        {
          title: "MyEmployment",
          url: `/gyms/${user!.gymId}/employees/${user!.gymEmploymentId}`,
          icon: User,
        },
        {
          title: "Employees",
          url: `/gyms/${user!.gymId}/employees`,
          icon: Users,
        },
        {
          title: "Entries",
          url: "/pass-uses",
          icon: NotepadText,
        },
        ...(isInRole(roles.GymAdministrator) && hasPaymentProfile
          ? [
              {
                title: "PaymentProfile",
                url: "/payment-profile",
                icon: CreditCard,
              },
            ]
          : []),
      ],
    });
  }

  if (isInRole(roles.User)) {
    navItems.splice(0, 0, {
      title: t("Passes"),
      url: `/passes`,
      icon: Ticket,
    });

    navItems.splice(3, 0, {
      title: t("MyPassUses"),
      url: `/pass-uses`,
      icon: NotepadText,
    });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 box-content border-b border-border p-0">
        <div
          className={`flex h-full items-center gap-2 overflow-hidden transition-all ${
            collapsed ? "justify-center w-full" : "px-4"
          }`}
        >
          <AppLogo className="size-5 shrink-0" />

          {!collapsed && (
            <span className="font-semibold text-foreground truncate ml-2">
              {constants.appName}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) =>
                item.children ? (
                  <SidebarMenuItem
                    key={item.title}
                    data-state={openMenus[item.title] ? "open" : "closed"}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={
                        item.url ? location.pathname === item.url : false
                      }
                      tooltip={t(item.title)}
                      data-state={openMenus[item.title] ? "open" : "closed"}
                    >
                      <NavLink to={item.url!}>
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.title)}</span>
                      </NavLink>
                    </SidebarMenuButton>

                    <SidebarMenuAction
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMenu(item.title);
                      }}
                    >
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openMenus[item.title] && "rotate-90",
                        )}
                      />
                    </SidebarMenuAction>

                    {openMenus[item.title] && (
                      <SidebarMenuSub>
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={location.pathname === child.url}
                              className={cn(
                                "data-[active=true]:bg-primary",
                                "data-[active=true]:text-primary-foreground",
                                "data-[active=true]:[&>svg]:text-primary-foreground",
                              )}
                            >
                              <NavLink to={child.url!}>
                                <child.icon className="h-4 w-4" />
                                <span>{t(child.title)}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={t(item.title)}
                    >
                      <NavLink to={item.url!}>
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.title)}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              tooltip={t("LogOut")}
              className={`hover:text-destructive ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-1 mr-5">{t("LogOut")}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
