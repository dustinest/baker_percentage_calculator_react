import {ChangeEvent, useState} from "react";
import {normalizeNumber} from "../../utils/NumberValue";
import {SuffixType, UseSuffix} from "./UseSuffix";
import {onNumberInputChange} from "../../utils/HtmlInputNumber";

type InputNumberProps = {
    value: number;
    suffix?: SuffixType;
    onChange: (value: number) => Promise<void>
}

export const InputNumber = ({value, suffix, onChange} : InputNumberProps) => {
    const _suffix = UseSuffix(suffix);
    const [newValue, setNewValue] = useState<number>(normalizeNumber(value));

    const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        onNumberInputChange(e)
            .then((e) => { return e ? e : 0})
            .then(normalizeNumber)
            .then((val) => {
                setNewValue(val);
                onChange(val).catch(console.error);
            })
            .catch(console.error);
    };

    return (<><input type="number"
                     value={newValue}
                     onChange={onValueChange}
    />{_suffix}</>)
}
