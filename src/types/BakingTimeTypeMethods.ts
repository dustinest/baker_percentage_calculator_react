import {copyNumberIntervalType} from "./NumberIntervalTypeMethods";
import {BakingTimeType} from "./BakingTimeType";

export const copyBakingTimeType = (value: BakingTimeType): BakingTimeType =>
  ({
    time: copyNumberIntervalType(value.time),
    temperature: copyNumberIntervalType(value.temperature),
    steam: value.steam,
  });
