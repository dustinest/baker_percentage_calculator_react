import {BakingTimeType} from "./BakingTimeType";
import {NumberIntervalType} from "./NumberInterval";

export type BakingAwareType = {
  innerTemperature: NumberIntervalType | null;
  bakingTime: BakingTimeType[];
  description: string | null;
}
