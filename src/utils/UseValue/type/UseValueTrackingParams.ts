export type UseValueTrackingParams<ValueType extends any = any,
  SetterType = ValueType,
  ResetType = SetterType> =
  {
    initValue: ValueType,
    valueParser: (value: SetterType, currentValue: ValueType, originalValue: ValueType) => ValueType,
    resetValueParser?: (value: ResetType | undefined, currentValue: ValueType, originalValue: ValueType) => ValueType,
    historyDepth?: number
  };

export type UseValueTrackingResult<ValueType extends any = any,
  SetterType = ValueType,
  ResetType = SetterType> = [
  ValueType,
  {
    setValue: (value: SetterType) => void,
    resetValue: (value?: ResetType) => void,
    resetToCurrentValue: () => void,
    resetToOriginalValue: () => void,
    undo: () => void
  },
  {
    equals: boolean,
    original: ValueType,
    history: ValueType[]
  }
];
