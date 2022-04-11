export type UseValueTrackingParams <
  ValueType extends any = any,
  SetterType = ValueType,
  ResetType = SetterType
  > =
  {
    initValue: ValueType,
    valueParser: (value: SetterType, currentValue: ValueType, originalValue: ValueType) => ValueType,
    resetValueParser?: (value: ResetType | undefined, currentValue: ValueType, originalValue: ValueType) => ValueType
  };

export type UseValueTrackingResult<
  ValueType extends any = any,
  SetterType = ValueType,
  ResetType = SetterType
  > = [ValueType, boolean, (value: SetterType) => void, (value?: ResetType) => void];
