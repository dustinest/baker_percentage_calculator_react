/**
 * Tests if value is not null and undefined
 * @param value to test
 * Returns true if value is set - not null and not undefined otherwise false
 */
export const hasValue = <T>(value: T | undefined | null): value is T => {
  if (value === undefined || value === null) return false;
  return !(typeof value === "number" && Number.isNaN(value));
}

/**
 * Tests if value is null or undefined
 * @param value to test
 * Returns true if value is null or undefined otherwise false
 */
export const hasNoValue = (value: any): value is null | undefined => !hasValue(value);

/**
 * Tests if value1 and value2 are both null or undefined or have the same value
 */
export const hasNoValueOrEquals = <T>(val1: T | undefined | null, val2: T | undefined | null): boolean =>
  ((hasNoValue(val1) && hasNoValue(val2)) || val1 === val2);
