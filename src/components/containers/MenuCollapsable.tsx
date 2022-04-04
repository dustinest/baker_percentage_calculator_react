import {ReactNode, useState} from "react";
import {Divider, Drawer, styled, Typography} from "@mui/material";
import {MenuCloseIcon, MenuOpenIcon} from "../common/Icons";
import {RIconButton} from "../common/RButton";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export const MenuCollapsable = ({ children, title }: { children: ReactNode, title?: string }) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    return (<>
        <RIconButton className="menu-trigger" onClick={handleDrawerOpen} icon={<MenuOpenIcon />} label="Menu" sx={{
            position: 'fixed',
            top: 0,
            left: 0,
        }} />
        <Drawer variant="persistent"
                    anchor="left"
                    open={open}>
            <DrawerHeader>
                <Typography variant="subtitle1" noWrap component="div">{title}</Typography>
                <RIconButton onClick={handleDrawerClose} icon={<MenuCloseIcon />} label="CLose menu"/>
            </DrawerHeader>
            <Divider />
            {children}
        </Drawer></>);
}
