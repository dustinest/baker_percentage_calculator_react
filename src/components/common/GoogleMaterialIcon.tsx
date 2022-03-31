import {useEffect, useState} from "react";
import {OnChangeType} from "../Input/OnChangeType";
import "./GoogleMaterialIcon.css";

type GoogleMaterialIconProps = {
    name: string;
    onClick?: () => void;
};

type GoogleMaterialIconPropsPrefix = {
    prefix: string;
    prefixOnClick?: () => void;
} & GoogleMaterialIconProps;

type GoogleMaterialIconPropsSuffix = {
    suffix: string;
    suffixOnClick?: () => void;
} & GoogleMaterialIconProps;

type GoogleMaterialIconLabelProps = {
    className: string;
} & GoogleMaterialIconProps;

const GoogleMaterialIconLabel = ({name, onClick, className}: GoogleMaterialIconLabelProps) => {
    return (<label className={className} onClick={onClick}>{name}</label>);
}

export const GoogleMaterialIcon = (props: GoogleMaterialIconProps | GoogleMaterialIconPropsPrefix | GoogleMaterialIconPropsSuffix) => {
    const [prefix, setPrefix] = useState<GoogleMaterialIconLabelProps | undefined>(undefined);
    const [suffix, setSuffix] = useState<GoogleMaterialIconLabelProps | undefined>(undefined);
    useEffect(() => {
        const _prefix = props as GoogleMaterialIconPropsPrefix;
        if (_prefix.prefix) {
            setPrefix({
                name: _prefix.prefix,
                onClick: _prefix.prefixOnClick,
                className: "material-icons-prefix"
            })
        }

        const _suffix = props as GoogleMaterialIconPropsSuffix;
        if (_suffix.suffix) {
            setSuffix({
                name: _suffix.suffix,
                onClick: _suffix.suffixOnClick,
                className: "material-icons-suffix"
            })
        }
    }, [props]);

    return (<>{prefix ? (<GoogleMaterialIconLabel {...prefix} />) : undefined}<span className="material-icons" onClick={props.onClick}>{props.name}</span>{suffix ? (<GoogleMaterialIconLabel {...suffix} />) : undefined}</>);
};

type GoogleMaterialSwitchProps = {
    labelBefore?: string;
    labelAfter?: string;
    value?: boolean;
    onChange: OnChangeType<boolean, void>;
    icons: {checked: string, unchecked: string}
};

export const GoogleMaterialSwitch = ({labelAfter, labelBefore, value, onChange, icons}: GoogleMaterialSwitchProps) => {
    const [isChecked, setChecked] = useState<boolean>(value === true);
    const onClick = () => { setChecked(!isChecked); }
    useEffect(() => {
        onChange(isChecked);
        // eslint-disable-next-line
    }, [isChecked])
    return (<GoogleMaterialIcon name={isChecked? icons.checked : icons.unchecked} onClick={onClick} suffix={labelAfter} prefix={labelBefore} suffixOnClick={onClick} prefixOnClick={onClick}/>)
}
