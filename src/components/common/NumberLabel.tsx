import {normalizeNumberString} from "../../utils/NumberValue";
import {SuffixType, UseSuffix} from "./UseSuffix";

export const NumberLabel = ({value, suffix, digits} : {value: number, suffix?: SuffixType, digits?: number}) => {
    const _suffix = UseSuffix(suffix);
    return (
        <label>{normalizeNumberString(value, digits)}{_suffix?.suffix}</label>
    );
}
