import {hasValue} from "./hasValue";
import {DefaultValueType, resolveDefaultProvider} from "./defaultProviders";

/**
 * Returns value if set otherwise defaultValue
 * @param value to return if is not null or not undefined
 * @param defaultValue to return if value is not provided
 */
export const valueOf = <T>(
  value: T | undefined | null,
  defaultValue: DefaultValueType<T>
): T => {
  if (hasValue(value)) return value;
  return resolveDefaultProvider(defaultValue);
};

/**
 * Returns null safe array with not null items
 * @param value - array to provide
 * Returns empty array if value is null or undefined otherwise array provided with null safe values
 */
export const valuesOf = <T>(value: T[] | undefined | null): T[] => {
  return valueOf(value, []).filter(hasValue);
};
