import {ChangeEvent, useEffect, useState} from "react";
import {normalizeNumber} from "../../utils/Numbers";
import {InputAdornment, OutlinedInput, TextField} from "@mui/material";
import {useTimeoutAsyncEffect} from "react-useasync-hooks";

export type SuffixType = "g" | "%";


const StandardInput = ({value, onChange, suffix, type, label, className}: {
    value: string | number;
    type: "string" | "number";
    onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    suffix?: SuffixType;
    label?: string;
    className?: string;
}
) => {
    return (<>{
            suffix ?
                (<OutlinedInput
                    type={type}
                    label={label}
                    value={value}
                    onChange={onChange}
                    className={className}
                    endAdornment={<InputAdornment position="end">{suffix}</InputAdornment>}
                />):
                (<TextField variant="standard" type={type} value={value} onChange={onChange} label={label} className={className}/>)
        }</>)
}

type InputValueProps<T> = {
    value: T;
    onChange: (value: T) => Promise<void>;
    timeout?: number;
    suffix?: SuffixType;
    label?: string;
    className?: string;
};

export const InputValue = <T extends number | string, >({value, onChange, suffix, label, className, timeout = 200}: InputValueProps<T>) => {
    const type: "string" | "number" = typeof value === "number" ? "number" : "string";
    const [valueUsed, setValueUsed] = useState<T | undefined>(undefined);

    useTimeoutAsyncEffect(async () => {
        if (valueUsed !== undefined && valueUsed !== value) {
            return onChange(valueUsed).catch(console.error);
        }
    }, [valueUsed], {milliseconds: timeout })

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

    return (<>{valueUsed !== undefined ? <StandardInput className={className} type={type} value={valueUsed} onChange={(e) => setNormalizedValue(e.target.value as T)} suffix={suffix} label={label}/> : undefined}</>)
}
