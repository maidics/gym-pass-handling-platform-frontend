import { useNavigate } from "react-router-dom";
import { User as UserIcon, LogOut, ChevronDown, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdownMenu.tsx";
import { Button } from "@ui/button.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar.tsx";
import { Badge } from "@ui/badge.tsx";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@ui/languageSwitcher.tsx";
import { useAuth } from "@hooks/user/useAuth.ts";
import { roles } from "@constants/roles.ts";
import { UserDto } from "@api/types.ts";

interface UserMenuProps {
  user: UserDto;
}

export function UserMenu({ user }: UserMenuProps) {
  const navigate = useNavigate();
  const initials = user
    ? `${user.firstName![0]}${user.lastName![0]}`.toUpperCase()
    : "XX";
  const { logout, isInRole } = useAuth();

  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2"
          isAnimated={false}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-center text-center">
            <span className="text-sm font-medium text-foreground">
              {user.firstName} {user.lastName}
            </span>
            {!isInRole(roles.User) && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 capitalize"
              >
                {t(user.roles[0])}
              </Badge>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <UserIcon className="mr-3 h-4 w-4" />
          {t("Profile")}
        </DropdownMenuItem>

        {/*<DropdownMenuItem>*/}
        {/*  <Settings className="mr-2 h-4 w-4" />*/}
        {/*  {t("Settings")}*/}
        {/*</DropdownMenuItem>*/}
        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-2 py-1.5 text-sm">
          <Languages className="w-4 h-4" />
          {t("DisplayLanguage")}
          <LanguageSwitcher variant="ghost" />
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("LogOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
