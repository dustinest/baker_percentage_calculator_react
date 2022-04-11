// noinspection ES6PreferShortImport
import {hasNoValue, hasValue} from "./hasValue";
import {DefaultValueType, resolveDefaultProvider} from "./defaultProviders";

type NullOrUnknownValueOrString = number | undefined | null | string;

const parseAnyNumber = (value: NullOrUnknownValueOrString, defaultValue: DefaultValueType<number>, hasComma: boolean): number => {
  if (hasNoValue(value)) {
    return resolveDefaultProvider(defaultValue);
  }
  if (typeof value === "number") return value;
  const valueStr = value.trim();
  if (valueStr.length === 0) {
    return resolveDefaultProvider(defaultValue);
  }
  const valueStrNumber = hasComma ? parseFloat(valueStr) : parseInt(valueStr);
  if (hasValue(valueStrNumber)) {
    return valueStrNumber;
  }
  // let's try to extract numbers from the string
  let isCommaDefined = !hasComma;
  const numberValues:string = valueStr.split('').map((character) => {
    if ((character === "." || character === ",") && !isCommaDefined) {
      isCommaDefined = true;
      return ".";
    }
    const result = parseInt(character);
    if (hasValue(result)) return character;
    return null;
  }).filter(hasValue).join("");
  const numberValuesNumber = hasComma ? parseFloat(numberValues) : parseInt(numberValues);
  if (hasValue(numberValuesNumber)) {
    return numberValuesNumber;
  }
  return resolveDefaultProvider(defaultValue);
}

/**
 * Returns value if set otherwise defaultValue
 * @param value to return if is not null or not undefined
 * @param defaultValue to return if value is not provided
 */
export const valueOfFloat = (value: NullOrUnknownValueOrString, defaultValue: DefaultValueType<number>): number => parseAnyNumber(value, defaultValue, true);
/**
 * Returns value if set otherwise defaultValue
 * @param value to return if is not null or not undefined
 * @param defaultValue to return if value is not provided
 */
export const valueOfInteger = (value: NullOrUnknownValueOrString, defaultValue: DefaultValueType<number>): number => parseAnyNumber(value, defaultValue, false);
