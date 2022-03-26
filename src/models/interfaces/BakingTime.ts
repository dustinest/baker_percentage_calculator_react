import {getNumberInterval, NumberInterval} from "./NumberInterval";
import {BakingTimeType} from "../types";

export interface BakingTime {
    getInterval(): NumberInterval;
    getTemperature(): NumberInterval;
    isSteam(): boolean;
    toType(): BakingTimeType;
}

const isStream = (payload: BakingTimeType | BakingTime): boolean => {
    if ((payload as BakingTimeType).steam) {
        // noinspection PointlessBooleanExpressionJS
        return (payload as BakingTimeType).steam === true;
    }
    // @ts-ignore
    if ((payload as BakingTimeType).isSteam) {
        // noinspection PointlessBooleanExpressionJS
        return (payload as BakingTime).isSteam() === true;
    }
    return false;
}

class SimpleBakingTime implements BakingTime {
    private readonly interval: NumberInterval;
    private readonly temperature: NumberInterval;
    private readonly steam: boolean;
    constructor(interval: NumberInterval, temperature: NumberInterval, steam: boolean) {
        this.interval = interval;
        this.temperature = temperature;
        this.steam = steam;
    }

    toType(): BakingTimeType {
        return {
            time: this.getInterval().toType(),
            temperature: this.getTemperature().toType(),
            steam: this.isSteam()
        }
    }

    getInterval(): NumberInterval { return this.interval; }
    getTemperature(): NumberInterval { return this.temperature; }
    isSteam(): boolean { return this.steam; }
}

export const getBakingTime = (value: BakingTimeType | BakingTime): BakingTime => {
    return new SimpleBakingTime(
        getNumberInterval((value as BakingTimeType).time ? (value as BakingTimeType).time : (value as BakingTime).getInterval()),
        getNumberInterval((value as BakingTimeType).temperature ? (value as BakingTimeType).temperature : (value as BakingTime).getTemperature()),
        isStream(value)
    )
}
