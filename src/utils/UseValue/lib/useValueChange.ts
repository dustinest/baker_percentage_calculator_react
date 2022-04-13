import {useEffect, useState} from "react";

const forceValueChange = <ValueType>(provided: any, previous: any): ValueType => {
  if (provided !== previous) {
    return provided as ValueType;
  } else {
    return previous as ValueType;
  }
}

export const useValueChange = <
  ValueType,
  ProvidedValueType = ValueType,
  >(
    value: ProvidedValueType,
    callBack?: (provided: ProvidedValueType, previous: ValueType | undefined) => ValueType
): ValueType => {
  const [cachedValue, setCachedValue] = useState<ValueType>( callBack ? callBack(value, undefined) : forceValueChange(value, undefined));

  useEffect(() => {
    const parsed = callBack ? callBack(value, cachedValue) : forceValueChange(value, cachedValue);
    if (parsed !== cachedValue) {
      setCachedValue(parsed as ValueType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return cachedValue;
}

