import {NumberIntervalType} from "./NumberIntervalType";

export const copyNumberIntervalType = (value: NumberIntervalType): NumberIntervalType => {
  return {
    from: value.from,
    until: value.until
  };
};
