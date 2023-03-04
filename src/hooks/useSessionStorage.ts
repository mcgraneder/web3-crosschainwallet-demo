import { useEffect, useState } from "react";

export const useSessionStorage = <T extends unknown>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [data, setData] = useState<T>(() => {
    let value;
    if (typeof window !== "undefined") {
      value = sessionStorage.getItem(key);
    }

    if (!value) return initialValue;
    return JSON.parse(value ? value : "");
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  }, [data]);

  return [data, setData];
};
