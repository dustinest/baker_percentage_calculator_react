import './RecipeNavigation.css';
import {
  Badge,
  Box,
  ButtonGroup,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  styled,
  Toolbar,
  Typography
} from "@mui/material";

import {ReactNode, useContext} from "react";
import {RecipeName} from "../common/RecipeName";
import {Translation} from "../../Translations";
import {CheckAllButton, ClearAllButton, DoneButton, MenuIconButton} from "../../Constant/Buttons";
import {RecipeType} from "../../types";
import {DrawerHeader} from "./wrapper/DrawerHeader";
import {NavigationAppBar} from "./wrapper/NavigationAppBar";
import {MainNavigationMainContainer} from "./wrapper/MainNavigationMainContainer";
import {useRecipeMenuState} from "./useRecipeMenuState";
import {useElementClientHeight} from "../common/useElementClientHeight";
import {CheckedIcon, PrintIcon, UnCheckedIcon} from "../../Constant/Icons";
import i18next from "i18next";
import {CommonMenuButton} from "../common/CommonMenu";
import {AppStateActionTypes, AppStateContext, useMessageSnackBar} from "../../State";
import {FLAGS} from "../../static/lib";
import {runLater} from "../../utils/Timeouts";

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

export const RecipeNavigation = ({children}: {children: ReactNode}) => {
  const [recipes, actions, recipeStatus] = useRecipeMenuState();

  const snackBar = useMessageSnackBar();
  const {appState, appStateDispatch} = useContext(AppStateContext);
  const handleDrawerClose = () => {
    appStateDispatch(AppStateActionTypes.MENU_CLOSE);
    runLater(actions.submit, 1);
  }

  const [menuHeight, setMenuElement] = useElementClientHeight();
  const [contentHeight, setHeaderElement] = useElementClientHeight();

  const onLangaugeChange = (language: string) => {
    i18next.changeLanguage(language, (error) => {
      if (error) snackBar.error(error).enqueue();
    }).catch(error => snackBar.error(error).enqueue());
  }

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline/>
      <NavigationAppBar position="fixed" open={appState.menuOpen.current} width={NAVIGATION_WIDTH} ref={setHeaderElement}>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <MenuIconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => appStateDispatch(AppStateActionTypes.MENU_OPEN)}
              sx={{mr: 2, ...(appState.menuOpen.current && {display: 'none'})}}
            />
            <Typography variant="h6" noWrap component="div">
              {recipeStatus.selectedRecipe ? <RecipeName recipe={recipeStatus.selectedRecipe}/> : <Translation label="title" count={recipeStatus.defaultSelected}/>}
            </Typography>
          </Box>
          {appState.menuOpen.current ? undefined :
            <>
              <CommonMenuButton>
                { FLAGS.map(({key, label, value}) =>
                  <MenuItem key={key}  selected={key === i18next.language}  onClick={() => onLangaugeChange(key)}>
                    <ListItemIcon><img src={value} width={20} alt={label}/></ListItemIcon>
                    <ListItemText>{label}</ListItemText>
                  </MenuItem>
                )}
                <Divider variant="middle" />
                <MenuItem onClick={() => appStateDispatch(AppStateActionTypes.PRINT_PREVIEW_OPEN)}>
                  <ListItemIcon><PrintIcon/></ListItemIcon>
                  <ListItemText><Translation label="actions.print"/></ListItemText>
                </MenuItem>
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
        open={appState.menuOpen.current}
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
      <MainNavigationMainContainer open={appState.menuOpen.current} width={NAVIGATION_WIDTH} menuHeight={contentHeight}>{children}</MainNavigationMainContainer>
    </Box>
  );
}
