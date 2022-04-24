import {ChangeEvent, useEffect, useState} from "react";
import {hasNoValueOrEquals, hasValue, valueOf, valueOfFloat} from "../../NullSafe";
import {UseValueTrackingParams, UseValueTrackingResult} from "../type/UseValueTrackingParams";

export const useValueTracking = <
  ValueType extends any = any,
  SetterType = ValueType,
  ResetType = SetterType
  >({initValue, valueParser, resetValueParser} : UseValueTrackingParams<ValueType, SetterType, ResetType>):
  UseValueTrackingResult<ValueType, SetterType, ResetType> =>
{
  const [value, setValue] = useState<ValueType>(initValue);
  const [original, setOriginal] = useState<ValueType>(initValue);

  useEffect(() => {
    setValue(initValue);
    setOriginal(initValue);
  }, [initValue])

  const setNewValue = (newValue: SetterType) => {
    const parsedValue = valueParser(newValue, value, original);
    if (!hasNoValueOrEquals(value, parsedValue)) {
      setValue(parsedValue);
    }
  }
  const resetValues = (newValue?: ResetType) => {
    const parsedValue = resetValueParser ? resetValueParser(newValue, value, original) : value;
    if (!hasNoValueOrEquals(value, parsedValue)) {
      setValue(parsedValue);
    }
    if (!hasNoValueOrEquals(original, parsedValue)) {
      setOriginal(parsedValue);
    }
  }
  return [value, hasNoValueOrEquals(value, original), setNewValue, resetValues, original];
}

export const useStringValueTracking = (value: string | null |undefined) =>
  useValueTracking<string, string | null | undefined, string |null |undefined>({
      initValue: valueOf(value, ""),
      valueParser: (newValue) => valueOf(newValue, ""),
      resetValueParser: (newValue, oldValue) => valueOf(newValue, oldValue)
    }
  );

export const useNumberValueTracking = (value: string | number | null |undefined) =>
  useValueTracking<number, string | number | null | undefined, string | number |null |undefined>({
      initValue: valueOfFloat(value, 0),
      valueParser: (newValue) => valueOfFloat(newValue, 0),
      resetValueParser: (newValue, oldValue) => valueOfFloat(newValue, oldValue)
    }
  );

export const useBooleanTracking = (value: boolean | null |undefined) =>
  useValueTracking<boolean, string | boolean | null | undefined, boolean |null |undefined>({
      initValue: value === true,
      valueParser: (newValue) => newValue === true,
      resetValueParser: (newValue, oldValue) => hasValue(newValue) ? newValue : oldValue
    }
  );

export const useStringInputValueTracking = (value: string | null |undefined) =>
  useValueTracking<string, ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, string |null |undefined>({
      initValue: valueOf(value, ""),
      valueParser: (newValue) => valueOf(newValue.target.value, ""),
      resetValueParser: (newValue, oldValue) => valueOf(newValue, oldValue)
    }
  );

export const useNumberInputValueTracking = (value: string | number | null |undefined) =>
  useValueTracking<number, ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, string | number |null |undefined>({
      initValue: valueOfFloat(value, 0),
      valueParser: (newValue) => valueOfFloat(newValue.target.value, 0),
      resetValueParser: (newValue, oldValue) => valueOfFloat(newValue, oldValue)
    }
  );

export const useBooleanInputValueTracking = (value: boolean | null |undefined) =>
  useValueTracking<boolean, ChangeEvent<HTMLInputElement>, boolean |null |undefined>({
      initValue: value === true,
      valueParser: (newValue) => newValue.target.checked,
      resetValueParser: (newValue, oldValue) => hasValue(newValue) ? newValue : oldValue
    }
  );
