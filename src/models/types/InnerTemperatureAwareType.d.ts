import {NumberIntervalType} from "./NumberIntervalType";
import {BakingTimeType} from "./BakingTimeType";

export type InnerTemperatureAwareType = {
    innerTemperature: NumberIntervalType | null;
    bakingTime: BakingTimeType[];
    description?: string;
}
