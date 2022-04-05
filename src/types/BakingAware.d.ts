import {BakingTimeType} from "./BakingTimeType";
import {NumberIntervalType} from "./NumberIntervalType";

export type BakingAwareType = {
  innerTemperature: NumberIntervalType | null;
  bakingTime: BakingTimeType[];
  description: string | null;
}
