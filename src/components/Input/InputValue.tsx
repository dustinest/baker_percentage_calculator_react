import {useEffect, useState} from "react";
import {normalizeNumber} from "../../utils/NumberValue";
import {OnChangeType} from "./OnChangeType";

type InputValueProps<T> = {
    value: T;
    onChange: OnChangeType<T, Promise<void>>;
    timeout?: number;
};

export const InputValue = <T extends number | string, >({value, onChange, timeout = 100}: InputValueProps<T>) => {
    const type: "string" | "number" = typeof value === "number" ? "number" : "string";
    const [tempValue, setTempValue] = useState<T | undefined>(undefined);
    const [timeoutValue, setTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);

    const clearTimeoutValue = (newTimeout?: NodeJS.Timeout) => {
        if (timeoutValue !== undefined) {
            clearTimeout(timeoutValue);
        }
        setTimeoutValue(newTimeout);
    };

    const setNormalizedValue = (val: T) => {
        const _value: T = type === "string" ? val : normalizeNumber(val as number) as T;
        if (_value !== tempValue) {
            setTempValue(_value as T);
        }
    }

    useEffect(() => {
        setNormalizedValue(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
        clearTimeoutValue(setTimeout(() => {
            if (tempValue !== undefined && tempValue !== value) {
                if (tempValue === value) return;
                onChange(tempValue).catch(console.error);
            }
        }, timeout));
        // eslint-disable-next-line
    }, [tempValue]);

    return (<>{tempValue !== undefined ? <input type={type} value={tempValue} onChange={(e) => setNormalizedValue(e.target.value as T)}/> : undefined}</>)
}
