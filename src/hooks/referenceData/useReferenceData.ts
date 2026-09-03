import { useQuery } from "@tanstack/react-query";
import api from "@api/api.ts";

const referenceDataKeys = {
  currencyRule: ["currencyRules"],
  countryAlpha2Codes: ["countryAlpha2Codes"],
};

export const useCurrencyRules = () => {
  return useQuery({
    queryKey: referenceDataKeys.currencyRule,
    queryFn: async () => {
      return await api.getCurrencyRules();
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useCountryAlpha2Codes = () => {
  return useQuery({
    queryKey: referenceDataKeys.countryAlpha2Codes,
    queryFn: async () => {
      return await api.getCountryAlpha2Codes();
    },
  });
};
