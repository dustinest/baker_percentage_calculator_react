import {copyNumberIntervalType, numberIntervalTypeEquals} from "./NumberIntervalTypeMethods";
import {BakingTimeType} from "./BakingTimeType";

export const copyBakingTimeType = (value: BakingTimeType): BakingTimeType =>
  ({
    time: copyNumberIntervalType(value.time),
    temperature: copyNumberIntervalType(value.temperature),
    steam: value.steam,
  });

export const bakingTimeEquals = (value1: BakingTimeType, value2: BakingTimeType) =>
  numberIntervalTypeEquals(value1.time, value2.time) &&
  numberIntervalTypeEquals(value1.temperature, value2.temperature) &&
  value1.steam === value2.steam;

