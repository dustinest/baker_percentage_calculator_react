import {ReactNode, SyntheticEvent, useContext, useEffect, useState} from "react";
import {Divider, Drawer, IconButton, styled, Tab, Tabs} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import {useTranslation} from "react-i18next";
import {SelectedRecipeContext, SetFilterAction, StateActionTypes} from "../../State";

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
    const {selectedRecipe, selectedRecipeDispatch} = useContext(SelectedRecipeContext);
    const [open, setOpen] = useState<boolean>(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const [tabIndex, setTabIndex] = useState<number>(selectedRecipe.filter ? 1 : 0);
    const handleTabSwitch = (event: SyntheticEvent, newValue: number) => {
        selectedRecipeDispatch({
            type: StateActionTypes.SET_FILTER,
            value: newValue === 1,
        } as SetFilterAction);
    }
    useEffect(() => {
        setTabIndex(selectedRecipe.filter ? 1 : 0);
    }, [selectedRecipe])

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
                <Tabs value={tabIndex} onChange={handleTabSwitch} aria-label="basic tabs example">
                    <Tab label={translation.t("All")}/>
                    <Tab label={translation.t("Edit")}/>
                </Tabs>
                <IconButton onClick={handleDrawerClose}><ChevronLeftIcon /></IconButton>
            </DrawerHeader>
            <Divider />
            {children}
        </Drawer></>);
}
