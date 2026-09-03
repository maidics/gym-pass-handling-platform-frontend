import { GymPassProductDto } from "@api/types.ts";

export const getGymPassProductDetails = (
  product: GymPassProductDto,
): [key: string, { count: number | undefined }] => {
  switch (product.type) {
    case "SingleUse":
      return ["SomeUses", { count: 1 }];
    case "MultiUse":
      return ["SomeUses", { count: product.totalUses }];
    case "Unlimited":
      return ["SomeDays", { count: product.daysAfterExpiring }];
  }
};
