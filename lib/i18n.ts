import { signal } from "@preact/signals";
import ee from "../locales/ee.json" with { type: "json" };
import gb from "../locales/gb.json" with { type: "json" };

export type Language = "ee" | "gb";

export const language = signal<Language>("ee");

export const t = (key: string, vars?: Record<string, string | number>): string => {
  const parts = key.split(".");
  let node: unknown = language.value === "ee" ? ee : gb;
  for (const part of parts) node = (node as Record<string, unknown>)?.[part];
  let out = typeof node === "string" ? node : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replace(`{{${k}}}`, String(v));
    }
  }
  return out;
};
