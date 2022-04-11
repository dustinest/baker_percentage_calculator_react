import {hasNoValueOrEquals, valueOf, valueOfFloat} from "../../../utils/NullSafe";
import {useState} from "react";

export type ValueAndOriginal<T>  = {
  value: T;
  original: T;
}

const useValueAndOriginal = <ValueType>(initValue: ValueType): [ValueType, boolean, (value: ValueType) => void, (value: ValueType) => void] => {
  const [value, setValue] = useState<ValueType>(initValue);
  const [original, setOriginal] = useState<ValueType>(initValue);

  const setNewValue = (newValue: ValueType) => {
    if (!hasNoValueOrEquals(value, newValue)) {
      setValue(newValue);
    }
  }
  const resetValues = (newValue: ValueType) => {
    if (!hasNoValueOrEquals(value, newValue)) {
      setValue(newValue);
    }
    if (!hasNoValueOrEquals(original, newValue)) {
      setOriginal(newValue);
    }
  }
  return [value, hasNoValueOrEquals(value, original), setNewValue, resetValues];
}

export const useNumberValueAndOriginal = (initValue?: number | string | null | undefined): [number, boolean, (value: number | string | null | undefined) => void, (value?: number | string | null | undefined) => void] => {
  const [value, isSame, setNewValue, resetValues] = useValueAndOriginal<number>(valueOfFloat(initValue, 0));
  const setNewNumberValue = (value: number | string | null | undefined) => {
    setNewValue(valueOfFloat(value, 0));
  }
  const resetNumberValue = (value?: number | string | null | undefined) => {
    resetValues(valueOfFloat(value, 0));
  }
  return [value, isSame, setNewNumberValue, resetNumberValue];
}

export const useStringValueAndOriginal = (initValue?: string | null | undefined): [string, boolean, (value: string | null | undefined) => void, (value?: string | null | undefined) => void] => {
  const [value, isSame, setNewValue, resetValues] = useValueAndOriginal<string>(valueOf(initValue, ""));
  const setNewNumberValue = (value: string | null | undefined) => {
    setNewValue(valueOf(value, ""));
  }
  const resetNumberValue = (value?: string | null | undefined) => {
    resetValues(valueOf(value, ""));
  }
  return [value, isSame, setNewNumberValue, resetNumberValue];
}
