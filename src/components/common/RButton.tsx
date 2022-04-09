import {ReactNode} from "react";
import {Button, ButtonGroup, IconButton, Theme} from "@mui/material";
import {SxProps} from "@mui/system";
import {Translation, useTranslation} from "../../Translations";

type RButtonPropsIcon = { icon: ReactNode; };
type RButtonPropsLabel = { label:string; };
type RButtonPropsClick = {onClick: () => void};

type BaseProps = {
    disabled?: boolean;
    sx?: SxProps<Theme>;
    className?: string;
}

type RButtonProps = BaseProps & RButtonPropsClick & (RButtonPropsIcon | RButtonPropsLabel);
type RIconButtonProps = {label?: string} & BaseProps & RButtonPropsClick & RButtonPropsIcon;
export const RIconButton = (props: RIconButtonProps) => {
    const translate = useTranslation();
    const label = (props as RButtonPropsLabel).label;
    return (<IconButton disabled={props.disabled} className={props.className} aria-label={label ? translate.translate(label) : undefined} sx={props.sx}  onClick={props.onClick}>{props.icon}</IconButton >);
}

export const RButton = (props: RButtonProps) => {
    const label = (props as RButtonPropsLabel).label;
    return (
        <Button
            variant="contained"
            color="inherit"
            sx={props.sx}
            disabled={props.disabled}
            className={props.className}
            onClick={(props as RButtonPropsClick).onClick}
            startIcon={(props as RButtonPropsIcon).icon}>{label ? <Translation label={label}/> : undefined }</Button>
    );
}

export type RButtonGroupProps = {
    label: string;
    actions: RButtonProps[];
}

export const RButtonGroup = (props: RButtonGroupProps) => {
    const translate = useTranslation();
    return (<ButtonGroup variant="contained" aria-label={translate.translate(props.label)}>{
        props.actions.map((e, index) => <RButton {...e} key={index}/>)
    }</ButtonGroup>)
}
