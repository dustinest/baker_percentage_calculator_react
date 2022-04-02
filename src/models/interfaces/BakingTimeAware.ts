import {NumberInterval} from "./NumberInterval";
import {BakingTime} from "./BakingTime";

export interface BakingTimeAware {
    getInnerTemperature(): NumberInterval | null;
    getBakingTime(): BakingTime[];
    getDescription(): string | null;
}
