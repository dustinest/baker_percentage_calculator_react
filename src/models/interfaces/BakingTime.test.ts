import {BakingTime, getBakingTime} from "./BakingTime";
import {NumberInterval} from "./NumberInterval";

describe("Baking time are defined", () => {
    it("getBakingTime works", () => {
        const time = getBakingTime({time: {from: 20, until: 10}, temperature: {from: 100, until: 200}, steam: true});
        expect(time.getInterval().getFrom()).toBe(10);
        expect(time.getInterval().getUntil()).toBe(20);
        expect(time.getTemperature().getFrom()).toBe(100);
        expect(time.getTemperature().getUntil()).toBe(200);
        expect(time.isSteam()).toBeTruthy();
    });

     it("Baking time and temperature interval is the same", () => {
        const time = getBakingTime({
            time: {from: 10, until: 10},
            temperature: {from: 100, until: 100},
            steam: false
        });
        expect(time.getInterval().getFrom()).toBe(10);
        expect(time.getInterval().getUntil()).toBe(10);
        expect(time.getTemperature().getFrom()).toBe(100);
        expect(time.getTemperature().getUntil()).toBe(100);
        expect(time.isSteam()).toBeFalsy();
    });

    it("Mixed case of baking time", () => {
        const time = getBakingTime({
            getInterval(): NumberInterval {
                return {
                    getFrom(): number {
                        return 20;
                    },
                    getUntil(): number {
                        return 10;
                    }
                } as NumberInterval;
            },
            isSteam(): boolean {
                return true;
            },
            getTemperature(): NumberInterval {
                return {
                    getFrom(): number {
                        return 100;
                    },
                    getUntil(): number {
                        return 200;
                    }
                } as NumberInterval;
            },
        } as BakingTime);

        expect(time.getInterval().getFrom()).toBe(10);
        expect(time.getInterval().getUntil()).toBe(20);
        expect(time.getTemperature().getFrom()).toBe(100);
        expect(time.getTemperature().getUntil()).toBe(200);
        expect(time.isSteam()).toBeTruthy();
    });

});
