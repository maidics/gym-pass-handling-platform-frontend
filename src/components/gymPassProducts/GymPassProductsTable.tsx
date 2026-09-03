import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table.tsx";
import { Badge } from "@ui/badge.tsx";
import { Switch } from "@ui/switch.tsx";
import { Button } from "@ui/button.tsx";
import { FilterableHeader } from "@ui/filterableHeader.tsx";
import { getPassTypeConfig } from "@lib/passTypeUtils";
import { getGymPassProductDetails } from "@lib/gymPassProductUtils.ts";
import { formatMoney } from "@lib/moneyUtils";
import { useAuth } from "@hooks/user/useAuth.ts";
import { roles } from "@constants/roles.ts";
import { GymPassProductDto } from "@api/types.ts";
import { UpdateGymPassProductDialog } from "@components/gymPassProducts/UpdateGymPassProductDialog.tsx";
import { cn } from "@lib/utils.ts";
import { BuyGymPassProductButton } from "@components/gymPassProducts/BuyGymPassProductButton.tsx";

interface GymPassProductsTableProps {
  products: GymPassProductDto[];
  isUpdating: boolean;
  onToggleActive: (product: GymPassProductDto) => void;
}

type ActivityFilter = "all" | "Active" | "Inactive";
type PriceSort = "all" | "LowToHigh" | "HighToLow";

type Widths = {
  name: string;
  type: string;
  details: string;
  price: string;
  status: string;
  edit?: string;
  active?: string;
  purchase?: string;
};

export function GymPassProductsTable({
  products,
  isUpdating,
  onToggleActive,
}: GymPassProductsTableProps) {
  const { t } = useTranslation();
  const { isInRole } = useAuth();

  const isGymAdmin = isInRole(roles.GymAdministrator);
  const showPurchase = isInRole(roles.User);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  const [priceSort, setPriceSort] = useState<PriceSort>("all");

  const typeOptions = useMemo(
    () => Array.from(new Set(products.map((p) => String(p.type)))),
    [products],
  );

  const activityOptions: ActivityFilter[] = ["Active", "Inactive"];
  const priceOptions: PriceSort[] = ["LowToHigh", "HighToLow"];

  const hasActiveFilters =
    typeFilter !== "all" || activityFilter !== "all" || priceSort !== "all";

  const clearFilters = () => {
    setTypeFilter("all");
    setActivityFilter("all");
    setPriceSort("all");
  };

  const getPriceValue = (p: GymPassProductDto) => {
    const price: any = p.price;
    if (typeof price === "number") return price;
    if (price && typeof price === "object" && typeof price.amount === "number")
      return price.amount;
    return 0;
  };

  const visibleProducts = useMemo(() => {
    let result = products;

    if (typeFilter !== "all") {
      result = result.filter((p) => String(p.type) === typeFilter);
    }

    if (activityFilter === "Active") {
      result = result.filter((p) => p.isActive);
    } else if (activityFilter === "Inactive") {
      result = result.filter((p) => !p.isActive);
    }

    const sorted = [...result];

    if (priceSort === "LowToHigh") {
      sorted.sort((a, b) => getPriceValue(a) - getPriceValue(b));
    } else if (priceSort === "HighToLow") {
      sorted.sort((a, b) => getPriceValue(b) - getPriceValue(a));
    }

    return sorted;
  }, [products, typeFilter, activityFilter, priceSort]);

  const widths: Widths = useMemo(() => {
    if (isGymAdmin && showPurchase) {
      return {
        name: "22%",
        type: "13%",
        details: "12%",
        price: "11%",
        status: "12%",
        edit: "7%",
        active: "8%",
        purchase: "15%",
      };
    }

    if (isGymAdmin) {
      return {
        name: "25%",
        type: "15%",
        details: "14%",
        price: "13%",
        status: "15%",
        edit: "8%",
        active: "10%",
      };
    }

    if (showPurchase) {
      return {
        name: "28%",
        type: "16%",
        details: "16%",
        price: "14%",
        status: "14%",
        purchase: "12%",
      };
    }

    return {
      name: "32%",
      type: "18%",
      details: "16%",
      price: "16%",
      status: "18%",
    };
  }, [isGymAdmin, showPurchase]);

  const colSpan = 5 + (isGymAdmin ? 2 : 0) + (showPurchase ? 1 : 0);

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-col overflow-hidden rounded-md border border-border bg-background",
        visibleProducts.length === 0 ? "h-full" : "max-h-full",
      )}
    >
      <Table className="w-full table-fixed border-collapse">
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead
              className="p-2 text-left sm:p-4"
              style={{ width: widths.name }}
            >
              {t("Name")}
            </TableHead>

            <TableHead
              className="p-2 text-left sm:p-4"
              style={{ width: widths.type }}
            >
              <div className="flex justify-start">
                <FilterableHeader
                  title={t("Type")}
                  currentValue={typeFilter}
                  onSelect={setTypeFilter}
                  options={typeOptions}
                  align="left"
                />
              </div>
            </TableHead>

            <TableHead
              className="p-2 text-left sm:p-4"
              style={{ width: widths.details }}
            >
              {t("Details")}
            </TableHead>

            <TableHead className="p-2 sm:p-4" style={{ width: widths.price }}>
              <div className="flex justify-end">
                <FilterableHeader
                  title={t("Price")}
                  currentValue={priceSort}
                  onSelect={setPriceSort}
                  options={priceOptions}
                  align="right"
                />
              </div>
            </TableHead>

            <TableHead className="p-2 sm:p-4" style={{ width: widths.status }}>
              <div className="flex justify-center">
                <FilterableHeader
                  title={t("Status")}
                  currentValue={activityFilter}
                  onSelect={setActivityFilter}
                  options={activityOptions}
                  align="center"
                />
              </div>
            </TableHead>

            {isGymAdmin && (
              <TableHead
                className="p-2 text-center sm:p-4"
                style={{ width: widths.edit }}
              >
                {t("Edit")}
              </TableHead>
            )}

            {isGymAdmin && (
              <TableHead
                className="p-2 text-center sm:p-4"
                style={{ width: widths.active }}
              >
                {t("Active")}
              </TableHead>
            )}

            {showPurchase && (
              <TableHead
                className="p-2 text-center sm:p-4"
                style={{ width: widths.purchase }}
              >
                {t("Purchase")}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {visibleProducts.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={colSpan}
                className="h-24 py-8 text-center text-sm text-muted-foreground"
              >
                {hasActiveFilters
                  ? t("NoPassProductsMatchFilters")
                  : t("NoPassProducts")}
                {hasActiveFilters && (
                  <div className="mt-2 flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-7 px-3"
                    >
                      <X className="mr-1 h-3 w-3" />
                      {t("ClearFilter")}
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ) : (
            visibleProducts.map((product) => {
              const typeConfig = getPassTypeConfig(product.type);

              return (
                <TableRow
                  key={product.id}
                  className="text-xs hover:bg-muted/50 sm:text-sm"
                >
                  <TableCell className="p-2 text-left font-medium sm:p-4">
                    <div>
                      <div>{product.name}</div>
                      <div className="line-clamp-1 text-xs font-normal text-muted-foreground">
                        {product.description}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="p-2 sm:p-4">
                    <div className="flex justify-start">
                      <Badge
                        variant={typeConfig.variant}
                        className={typeConfig.className}
                      >
                        {t(product.type)}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="p-2 text-left text-muted-foreground sm:p-4">
                    {t(...getGymPassProductDetails(product))}
                  </TableCell>

                  <TableCell className="p-2 text-right font-medium sm:p-4">
                    {formatMoney(product.price)}
                  </TableCell>

                  <TableCell className="p-2 sm:p-4">
                    <div className="flex justify-center">
                      {product.isActive ? (
                        <Badge
                          variant="default"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          {t("Active")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <X className="mr-1 h-3 w-3" />
                          {t("Inactive")}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {isGymAdmin && (
                    <TableCell className="p-2 sm:p-4">
                      <div className="flex justify-center">
                        <UpdateGymPassProductDialog gymPassProduct={product} />
                      </div>
                    </TableCell>
                  )}

                  {isGymAdmin && (
                    <TableCell className="p-2 sm:p-4">
                      <div className="flex justify-center">
                        <Switch
                          checked={product.isActive}
                          onCheckedChange={() => onToggleActive(product)}
                          disabled={isUpdating}
                        />
                      </div>
                    </TableCell>
                  )}

                  {showPurchase && (
                    <TableCell className="p-2 sm:p-4">
                      <div className="flex justify-center">
                        <BuyGymPassProductButton
                          productId={product.id}
                          isProductActive={product.isActive}
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
