import {ChangeEvent} from "react";
import {onNumberInputChange} from "../../utils/HtmlInputNumber";
import {normalizeNumber} from "../../utils/NumberValue";
import {SuffixType, UseSuffix} from "./UseSuffix";

type InputNumberProps = {
    value: number;
    suffix?: SuffixType;
    onChange: (value: number) => Promise<void>
}

export const InputNumber = ({value, suffix, onChange} : InputNumberProps) => {
    const _suffix = UseSuffix(suffix);
    const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        onNumberInputChange(e).then(onChange).catch(console.error);
    };

    return (<><input type="number" value={normalizeNumber(value)} onChange={onValueChange}/>{_suffix}</>)
}
