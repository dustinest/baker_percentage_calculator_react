import {OnChangeType} from "./OnChangeType";
import {ChangeEvent, useEffect, useState} from "react";

type InputCheckBoxProps = {
    label?: string;
    value?: boolean;
    onChange: OnChangeType<boolean, void>;
};
export const InputCheckBox = ({value, label, onChange}: InputCheckBoxProps) => {
    const [isChecked, setChecked] = useState<boolean>(value === true);
    const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked !== isChecked) {
            setChecked(e.target.checked);
        }
    };
    useEffect(() => {
        onChange(isChecked);
        // eslint-disable-next-line
    }, [isChecked])
    return (
        <>
            <input type="checkbox" checked={isChecked} onChange={_onChange}/>{label ? <label onClick={() => setChecked(!isChecked)}>{label}</label> : undefined}
        </>
    )
}
