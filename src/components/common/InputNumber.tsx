import {SuffixType, UseSuffix} from "./UseSuffix";
import {InputValue} from "./InputValue";

type InputNumberProps = {
    value: number;
    suffix?: SuffixType;
    onChange: (value: number) => Promise<void>
}


export const InputNumber = ({value, suffix, onChange} : InputNumberProps) => {
    const _suffix = UseSuffix(suffix);
    return (<><InputValue value={value} onChange={onChange}/>{_suffix}</>)
}
