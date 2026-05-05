import { signal, effect } from "@preact/signals";

const PARAM = "r";

export const parseUrlIds = (): Set<string> => {
  if (typeof globalThis.location === "undefined") return new Set();
  const raw = new URLSearchParams(globalThis.location.search).get(PARAM);
  if (!raw) return new Set();
  try {
    const decoded = atob(raw);
    return new Set(decoded.split(",").filter(Boolean));
  } catch {
    return new Set();
  }
};

export const encodeIds = (ids: Set<string>): string => btoa([...ids].join(","));

export const syncUrlEffect = (selectedIds: ReturnType<typeof signal<Set<string>>>) => {
  effect(() => {
    if (typeof globalThis.history === "undefined") return;
    const ids: Set<string> = selectedIds.value ?? new Set();
    const url = new URL(globalThis.location.href);
    if (ids.size === 0) {
      url.searchParams.delete(PARAM);
    } else {
      url.searchParams.set(PARAM, encodeIds(ids));
    }
    globalThis.history.replaceState(null, "", url.toString());
  });
};
