import {BakingTimeAware} from "./BakingTimeAware";
import {InnerTemperatureAwareType} from "../types/InnerTemperatureAwareType";
import {BakingTimeType, NumberIntervalType} from "../types";
import {getNumberInterval, NumberInterval} from "./NumberInterval";
import {BakingTime, getBakingTime} from "./BakingTime";

export const resolveBakingTimeAwareInnerTemperatureType = (value: BakingTimeAware | InnerTemperatureAwareType): NumberIntervalType | null => {
    if ((value as BakingTimeAware).getInnerTemperature) {
        const result = (value as BakingTimeAware).getInnerTemperature();
        return (result !== null && result !== undefined) ? result.toType() : null;
    }
    const result = (value as InnerTemperatureAwareType).innerTemperature;
    return (result !== null && result !== undefined) ? {...result} : null;
}

export const resolveBakingTimeAwareInnerTemperature = (value: BakingTimeAware | InnerTemperatureAwareType): NumberInterval | null => {
    const result = resolveBakingTimeAwareInnerTemperatureType(value);
    return result ? getNumberInterval(result) : null;
}

export const resolveBakingTimeAwareDescription = (value: BakingTimeAware | InnerTemperatureAwareType): string | null => {
    if ((value as BakingTimeAware).getDescription) {
        return (value as BakingTimeAware).getDescription();
    }
    const result = (value as InnerTemperatureAwareType).description;
    if (result === undefined) return null;
    return result;
}

export const resolveBakingTimeAwareBakingTimeType = (value: BakingTimeAware | InnerTemperatureAwareType): BakingTimeType[] => {
    if ((value as BakingTimeAware).getBakingTime) {
        return (value as BakingTimeAware).getBakingTime().map(e => e.toType());
    }
    return (value as InnerTemperatureAwareType).bakingTime.map(e => ({...e}));
}

export const resolveBakingTimeAwareBakingTime = (value: BakingTimeAware | InnerTemperatureAwareType): BakingTime[] => {
    return resolveBakingTimeAwareBakingTimeType(value).map(getBakingTime);
}
