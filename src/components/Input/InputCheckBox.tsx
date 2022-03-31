import {OnChangeType} from "./OnChangeType";
import "./InputCheckBox.css";
import {GoogleMaterialSwitch} from "../common/GoogleMaterialIcon";

type InputCheckBoxProps = {
    label?: string;
    value?: boolean;
    onChange: OnChangeType<boolean, void>;
};
export const InputCheckBox = ({value, label, onChange}: InputCheckBoxProps) => {
    return (
        <span className="checkbox">
            <GoogleMaterialSwitch value={value} onChange={onChange} labelAfter={label} icons={{checked: "task_alt", unchecked: "radio_button_unchecked"}}/>
        </span>
    )
}
