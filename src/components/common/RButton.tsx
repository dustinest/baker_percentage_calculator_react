import {ReactNode} from "react";
import {Button, ButtonGroup, IconButton, Theme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {SxProps} from "@mui/system";

type RButtonPropsIcon = { icon: ReactNode; };
type RButtonPropsLabel = { label:string; };
type RButtonPropsClick = {onClick: () => void};

type BaseProps = {
    sx?: SxProps<Theme>;
    className?: string;
}

type RButtonProps = BaseProps & RButtonPropsClick & (RButtonPropsIcon | RButtonPropsLabel);

const useLabelTranslation = (label?: string): string | undefined => {
    const translate = useTranslation();
    return label ? translate.t(label) : undefined;
}

export const RIconButton = (props: BaseProps & RButtonPropsClick & RButtonPropsIcon & RButtonPropsLabel) => {
    const label = useLabelTranslation((props as RButtonPropsLabel).label);
    return (<IconButton className={props.className} aria-label={label} sx={props.sx}  onClick={props.onClick}>{props.icon}</IconButton >);
}

export const RButton = (props: RButtonProps) => {
    return (
        <Button
            variant="contained"
            color="inherit"
            sx={props.sx}
            className={props.className}
            onClick={(props as RButtonPropsClick).onClick}
            startIcon={(props as RButtonPropsIcon).icon}>{useLabelTranslation((props as RButtonPropsLabel).label)}</Button>
    );
}

export type RButtonGroupProps = {
    label: string;
    actions: RButtonProps[];
}

export const RButtonGroup = (props: RButtonGroupProps) => {
    const translate = useTranslation();
    return (<ButtonGroup variant="contained" aria-label={translate.t(props.label)}>{
        props.actions.map((e, index) => <RButton {...e} key={index}/>)
    }</ButtonGroup>)
}
