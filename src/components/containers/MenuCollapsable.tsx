import {ReactNode, useState} from "react";
import {Divider, Drawer, IconButton, styled} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import {useTranslation} from "react-i18next";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export const MenuCollapsable = ({ children }: { children: ReactNode }) => {
    const translation = useTranslation();
    const [open, setOpen] = useState<boolean>(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    return (<>
        <IconButton color="inherit" className="menu-trigger" aria-label={translation.t("Menu")} sx={{
            position: 'fixed',
            top: 0,
            left: 0,
        }}  onClick={handleDrawerOpen}>
            <MenuOutlinedIcon />
        </IconButton >
        <Drawer variant="persistent"
                    anchor="left"
                    open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}><ChevronLeftIcon /></IconButton>
            </DrawerHeader>
            <Divider />
            {children}
        </Drawer></>);
}
