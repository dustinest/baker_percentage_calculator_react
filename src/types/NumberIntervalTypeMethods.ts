import {NumberIntervalType} from "./NumberIntervalType";

export const copyNumberIntervalType = (value: NumberIntervalType): NumberIntervalType => {
  return {
    from: value.from,
    until: value.until
  };
};

export const numberIntervalTypeEquals = (value1: NumberIntervalType, value2: NumberIntervalType) =>
  value1.from === value2.from && value1.until === value2.until;
