import * as React from "react";
import {
  CheckCircle,
  Ticket,
  XCircle,
  SquareArrowOutUpRight,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { useTranslation } from "react-i18next";
import { GymDto } from "@api/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/user/useAuth";
import { roles } from "@constants/roles";
import { formatMoney } from "@lib/moneyUtils";
import { cn } from "@lib/utils";
import { Separator } from "@ui/separator.tsx";
import { BuyGymPassProductButton } from "@components/gymPassProducts/BuyGymPassProductButton.tsx";

export function GymDetailsPassesCard({
  gym,
  className,
}: {
  gym: GymDto;
  className?: string;
}) {
  const { t } = useTranslation();
  const { isInRole } = useAuth();
  const navigate = useNavigate();

  const passProducts = gym.passProducts ?? [];
  const passCount = passProducts.length;
  const isEmpty = passCount === 0;

  const canManagePassProducts =
    isInRole(roles.GymAdministrator) || isInRole(roles.GymStaff);

  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [isVertScrollable, setIsVertScrollable] = React.useState(false);

  const measureScroll = React.useCallback(() => {
    const el = tableContainerRef.current;
    if (!el) return;
    setIsVertScrollable(el.scrollHeight > el.clientHeight + 1);
  }, []);

  React.useEffect(() => {
    measureScroll();

    const el = tableContainerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(measureScroll);
    ro.observe(el);

    const table = el.querySelector("table");
    if (table) ro.observe(table);

    return () => ro.disconnect();
  }, [measureScroll, passCount]);

  const showCTA = canManagePassProducts && !isVertScrollable;

  return (
    <Card className={cn("flex flex-col min-h-0 min-w-0", className)}>
      <CardHeader className="pb-3 shrink-0 flex flex-row items-start justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium min-w-0">
          <Ticket className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="flex items-center gap-2 min-w-0">
            <span className="truncate">{t("PassesOrTickets")}</span>
            <Badge variant="secondary" className="shrink-0">
              {passCount}
            </Badge>
          </span>
        </CardTitle>

        <Button
          type="button"
          className="text-muted-foreground hover:text-foreground shrink-0"
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/gyms/${gym.id}/pass-products`)}
          aria-label={t("ViewAll", "View all")}
        >
          <SquareArrowOutUpRight className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex-1 min-h-0 min-w-0 flex flex-col">
        <Table
          containerRef={tableContainerRef}
          className="min-w-[900px]"
          containerClassName="max-h-[420px] lg:max-h-full"
        >
          <TableHeader>
            <TableRow>
              <TableHead>{t("Name")}</TableHead>
              <TableHead>{t("Type")}</TableHead>
              <TableHead>{t("Price")}</TableHead>
              <TableHead className="text-center">{t("Status")}</TableHead>
              <TableHead className="text-right">{t("Purchase")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {passProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="min-w-0">
                  <div className="min-w-0">
                    <p className="font-medium break-words">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-[240px]">
                        {product.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {t(product.type)}
                    {product.totalUses && ` (${product.totalUses})`}
                    {product.daysAfterExpiring &&
                      " " + product.daysAfterExpiring + t("DayAbbr")}
                  </Badge>
                </TableCell>

                <TableCell className="font-medium">
                  {formatMoney(product.price)}
                </TableCell>

                <TableCell className="text-center">
                  {product.isActive ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500 inline" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground inline" />
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <BuyGymPassProductButton
                    productId={product.id}
                    isProductActive={product.isActive}
                  />
                </TableCell>
              </TableRow>
            ))}

            {isEmpty && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  <div className="flex w-full justify-center">
                    <span className="inline-flex items-center gap-2">
                      <Info className="h-3 w-3" />
                      {t("NoPassesAvailable")}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {showCTA && (
          <>
            <Separator />
            <div className="hidden lg:flex flex-1 items-center justify-center p-4">
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2"
                onClick={() => navigate(`/gyms/${gym.id}/pass-products`)}
              >
                <ArrowUpRight className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {t("CreateMorePassProductsHere")}
                </span>
                <span className="sm:hidden">{t("ManagePasses")}</span>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
