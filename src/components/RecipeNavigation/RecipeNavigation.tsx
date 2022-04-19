import './RecipeNavigation.css';
import {
  List,
  Typography,
  ListItem,
  ButtonGroup,
  Box,
  Divider,
  CssBaseline,
  Toolbar,
  Drawer,
  styled,
  Badge,
  ListItemText, ListItemButton, ListItemIcon, MenuItem
} from "@mui/material";

import {ReactNode, useState} from "react";
import {RecipeName} from "../common/RecipeName";
import {Translation} from "../../Translations";
import {
  CheckAllButton,
  ClearAllButton,
  DoneButton,
  MenuIconButton, TranslatedLanguageIconButton,
  TranslatedPrintIconButton
} from "../../Constant/Buttons";
import {RecipeType} from "../../types";
import {DrawerHeader} from "./wrapper/DrawerHeader";
import {NavigationAppBar} from "./wrapper/NavigationAppBar";
import {MainNavigationMainContainer} from "./wrapper/MainNavigationMainContainer";
import {useRecipeMenuState} from "./useRecipeMenuState";
import {useElementClientHeight} from "../common/useElementClientHeight";
import {CheckedIcon, UnCheckedIcon} from "../../Constant/Icons";
import i18next from "i18next";
import {CommonMenuButton} from "../common/CommonMenu";
import {useMessageSnackBar} from "../../State";

const NAVIGATION_WIDTH = 260;

type RecipeItemNameProps = {
  recipe: RecipeType;
  selected: boolean;
  onChange: (id: string, newState: boolean) => void;
};

const RecipeItemName = ({recipe, selected, onChange}: RecipeItemNameProps) => {
   return (
     <ListItem dense onClick={() => onChange(recipe.id, !selected)}>
       <ListItemButton dense disableGutters>
         <ListItemIcon>{ selected ? <CheckedIcon/> : <UnCheckedIcon/> }</ListItemIcon>
         <ListItemText>
           <RecipeName recipe={recipe}/>
         </ListItemText>
       </ListItemButton>
     </ListItem>
   );
}


const RecipesList = styled('div')<{top: number}>(({  top }) => ({
  display: "block",
  overflowY: "auto",
  marginTop: `${top}px`
}));

export const RecipeNavigation = ({children, onPrint}: {onPrint: () => void, children: ReactNode}) => {
  const [recipes, actions, recipeStatus] = useRecipeMenuState();

  const [isOpen, setIsOpen] = useState(false);

  const handleDrawerOpen = () => setIsOpen(true);
  /*
  const handleDrawerCancel = () => {
    actions.cancel();
    setIsOpen(false);
  };
  */


  const handleDrawerClose = () => {
    setIsOpen(false);
    actions.submit();
  }

  const [menuHeight, setMenuElement] = useElementClientHeight();
  const [contentHeight, setHeaderElement] = useElementClientHeight();

  const snackBar = useMessageSnackBar();
  const onLangaugeChange = (language: string) => {
    i18next.changeLanguage(language, (error) => {
      if (error) snackBar.error(error).enqueue();
    }).catch(error => snackBar.error(error).enqueue());
  }

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline/>
      <NavigationAppBar position="fixed" open={isOpen} width={NAVIGATION_WIDTH} ref={setHeaderElement}>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <MenuIconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              sx={{mr: 2, ...(isOpen && {display: 'none'})}}
            />
            <Typography variant="h6" noWrap component="div">
              {recipeStatus.selectedRecipe ? <RecipeName recipe={recipeStatus.selectedRecipe}/> : <Translation label="title" count={recipeStatus.defaultSelected}/>}
            </Typography>
          </Box>
          {isOpen ? undefined :
            <>
              <CommonMenuButton>
                { i18next.languages.map((lang) =>
                  <MenuItem key={lang}  selected={lang === i18next.language}><TranslatedLanguageIconButton onClick={() => onLangaugeChange(lang)} translation={`language.${lang}`}/></MenuItem>
                )}
                <MenuItem><TranslatedPrintIconButton onClick={onPrint}/></MenuItem>
              </CommonMenuButton>
            </>
          }
        </Toolbar>
      </NavigationAppBar>
      <Drawer
        sx={{
          width: NAVIGATION_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: NAVIGATION_WIDTH,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
        <DrawerHeader ref={setMenuElement} width={NAVIGATION_WIDTH}>
          <ButtonGroup>
            <CheckAllButton disabled={recipeStatus.allSelected} onClick={actions.selectAll}/>
            <ClearAllButton disabled={recipeStatus.noneSelected} onClick={actions.selectNone}/>
          </ButtonGroup>
          <ButtonGroup variant="contained">
            <Badge badgeContent={recipeStatus.selectedAmount} overlap="circular" color={recipeStatus.hasChange ? "info" : "success" }>
              <DoneButton  onClick={handleDrawerClose} color={recipeStatus.hasChange ? "success" : "info" }/>
            </Badge>
          </ButtonGroup>
        </DrawerHeader>
        <Divider/>
        <RecipesList top={menuHeight}>
        <List>
          {recipes.map((recipe) => (
            <RecipeItemName recipe={recipe.recipe} selected={recipe.selected} onChange={actions.select} key={recipe.id}/>
          ))}
        </List>
        </RecipesList>
      </Drawer>
      <MainNavigationMainContainer open={isOpen} width={NAVIGATION_WIDTH} menuHeight={contentHeight}>{children}</MainNavigationMainContainer>
    </Box>
  );
}
