import {NumberIntervalType} from "../types";

export interface NumberInterval {
    getFrom(): number;
    getUntil(): number;
    toType(): NumberIntervalType;
}


class SimpleNumberInterval implements NumberInterval {
    private readonly min;
    private readonly max;
    constructor(min: number, max: number) {
        this.min = Math.min(min, max);
        this.max = Math.max(min, max);
    }

    getFrom(): number { return this.min; }
    getUntil(): number { return this.max; }

    toType(): NumberIntervalType {
        return {
            from: this.getFrom(),
            until: this.getUntil()
        }
    }
}

export const getNumberInterval = (value: NumberIntervalType | NumberInterval | number): NumberInterval => {
    if (typeof value === "number") {
        return new SimpleNumberInterval(value as number, value as number);
    }
    return new SimpleNumberInterval(
        (value as NumberInterval).getFrom ? (value as NumberInterval).getFrom() : (value as NumberIntervalType).from,
        (value as NumberInterval).getUntil ? (value as NumberInterval).getUntil() : (value as NumberIntervalType).until
    );
};
