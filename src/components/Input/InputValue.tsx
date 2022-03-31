import {ChangeEvent, useEffect, useState} from "react";
import {normalizeNumber} from "../../utils/NumberValue";
import {OnChangeType} from "./OnChangeType";
import {InputAdornment, OutlinedInput, TextField} from "@mui/material";
import {SuffixData, SuffixType, UseSuffix} from "../common/UseSuffix";

type InputValueProps<T> = {
    value: T;
    onChange: OnChangeType<T, Promise<void>>;
    timeout?: number;
    suffix?: SuffixType;
};

const StandardInput = ({value, onChange, suffix, type}: {
    value: string | number,
    type: "string" | "number",
    onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    suffix: SuffixData | undefined}
) => {
    return (<>{
            suffix ?
                (<OutlinedInput
                    type={type}
                    id="outlined-adornment-weight"
                    value={value}
                    onChange={onChange}
                    endAdornment={<InputAdornment position="end">{suffix.suffix}</InputAdornment>}
                    inputProps={{
                        'aria-label': suffix.label,
                    }}
                />):
                (<TextField id="standard-basic" variant="standard" type={type} value={value} onChange={onChange}/>)
        }</>)
}

export const InputValue = <T extends number | string, >({value, onChange, suffix, timeout = 100}: InputValueProps<T>) => {
    const type: "string" | "number" = typeof value === "number" ? "number" : "string";
    const [valueUsed, setValueUsed] = useState<T | undefined>(undefined);
    const [timeoutValue, setTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);
    const _suffix = UseSuffix(suffix);

    const clearTimeoutValue = (newTimeout?: NodeJS.Timeout) => {
        if (timeoutValue !== undefined) {
            clearTimeout(timeoutValue);
        }
        setTimeoutValue(newTimeout);
    };

    const setNormalizedValue = (val: T) => {
        const _value: T = type === "string" ? val : normalizeNumber(val as number) as T;
        if (_value !== valueUsed) {
            setValueUsed(_value as T);
        }
    }

    useEffect(() => {
        setNormalizedValue(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
        clearTimeoutValue(setTimeout(() => {
            if (valueUsed !== undefined && valueUsed !== value) {
                if (valueUsed === value) return;
                onChange(valueUsed).catch(console.error);
            }
        }, timeout));
        // eslint-disable-next-line
    }, [valueUsed]);

    return (<>{valueUsed !== undefined ? <StandardInput type={type} value={valueUsed} onChange={(e) => setNormalizedValue(e.target.value as T)} suffix={_suffix}/> : undefined}</>)
}
