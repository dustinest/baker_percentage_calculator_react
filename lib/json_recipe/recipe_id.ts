// ── ID generators ───────────────────────────────────────────────────────────
let oldId = 1;
export const resolveJsonRecipeTypeId = (value: { name: string | Record<string, string>; id?: string; amount?: number }): string => {
  if (value.id) return value.id;
  return `${oldId++}`
  //return base64Encode("json", "ingredient", nameStr(value.name), value.amount || 1);
};
