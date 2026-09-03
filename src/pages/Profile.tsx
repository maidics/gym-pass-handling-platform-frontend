import { AlertTriangle, Mail, Globe, User, MailCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@components/ui/card.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar.tsx";
import { Badge } from "@components/ui/badge.tsx";
import { Separator } from "@components/ui/separator.tsx";
import { Button } from "@components/ui/button.tsx";
import { useAuth } from "@hooks/user/useAuth.ts";
import { useTranslation } from "react-i18next";
import { UpdateProfileDialog } from "@components/profile/UpdateProfileDialog.tsx";
import { DeleteAccountDialog } from "@components/profile/DeleteAccountDialog.tsx";
import { roles } from "@constants/roles.ts";
import { UpdatePasswordDialog } from "@components/profile/UpdatePasswordDialog.tsx";
import { LoadingSkeleton } from "@ui/loadingSkeleton.tsx";

export default function Profile() {
  const { user, isLoading, sendEmailConfirmation, isInRole } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!user) return null;

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : "XX";

  const userRole = user.roles && user.roles.length > 0 ? user.roles[0] : "User";

  const handleSendEmailConfirmation = async () => {
    try {
      await sendEmailConfirmation();
    } catch (error) {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("Profile")}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("AccountDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </h3>
                <Badge variant="outline" className="capitalize mt-1">
                  {t(userRole)}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <ProfileField
                  icon={<User className="h-4 w-4" />}
                  label={t("Name")}
                  value={t("PersonFullName", {
                    first: user.firstName,
                    last: user.lastName,
                  })}
                />
              </div>

              <ProfileField
                icon={<Mail className="h-4 w-4" />}
                label={t("EmailAddress")}
                value={user.email ?? ""}
              />
              <ProfileField
                icon={<Globe className="h-4 w-4" />}
                label={t("DisplayLanguage")}
                value={user.preferredLanguage ?? "en-US"}
              />
            </div>

            <Separator />

            <div className="flex items-center gap-2 w-full">
              <UpdateProfileDialog />

              <UpdatePasswordDialog />

              {!isInRole(roles.AppAdministrator) && <DeleteAccountDialog />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("AccountStatus")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!user.isEmailConfirmed ? (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    {t("EmailNotConfirmed")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("EmailConfirmDescription")}
                  </p>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="mt-2"
                    onClick={() => handleSendEmailConfirmation()}
                    isLoading={isLoading}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {t("Verify")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <MailCheck className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {t("EmailVerified")}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ProfileField({ icon, label, value }: ProfileFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
