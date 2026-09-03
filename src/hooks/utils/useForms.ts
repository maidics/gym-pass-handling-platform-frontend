import { useCallback, useState } from "react";

type Obj = Record<string, any>;

export function useFormState<T extends Obj>(initial: T) {
  const [data, setData] = useState<T>(initial);

  const handleChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const setNestedValue = useCallback(
    <P extends keyof T, C extends keyof NonNullable<T[P]>>(
      parent: P,
      child: C,
      value: NonNullable<T[P]>[C],
    ) => {
      setData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] as any),
          [child]: value,
        },
      }));
    },
    [],
  );

  return { data, setData, handleChange, setNestedValue };
}
