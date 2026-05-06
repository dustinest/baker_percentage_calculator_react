import { BakingTimeType, NumberIntervalType } from "../types.ts";

export const resolveNumberIntervalType = (value: NumberIntervalType | number): NumberIntervalType => {
  const first = typeof value === "number" ? value : value.from;
  const second = typeof value === "number" ? value : value.until;
  return { from: Math.min(first, second), until: Math.max(first, second) };
};

export const resolveInnerTemperature = (value?: NumberIntervalType | number | null): NumberIntervalType | null => {
  if (value == null) return null;
  return resolveNumberIntervalType(value);
};

export const resolveBakingTime = (
  bakingTimes?: Array<{
    time: NumberIntervalType | number;
    temperature: NumberIntervalType | number;
    steam?: boolean;
    label?: string | Record<string, string>;
  }>,
): BakingTimeType[] => {
  if (!bakingTimes) return [];
  return bakingTimes.map((bt) => ({
    time: resolveNumberIntervalType(bt.time),
    temperature: resolveNumberIntervalType(bt.temperature),
    steam: bt.steam === true,
    ...(bt.label ? { label: typeof bt.label === "string" ? { et: bt.label, en: bt.label } : bt.label } : {}),
  }));
};

// Inverse of resolveNumberIntervalType: collapses equal bounds to a plain number.
export const normalizeInterval = (v: NumberIntervalType): NumberIntervalType | number =>
  v.from === v.until ? v.from : { from: v.from, until: v.until };
