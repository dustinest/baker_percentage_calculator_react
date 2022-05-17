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
  Toolbar,
} from "@mui/material";

import {ReactNode, useState} from "react";
import {RecipeName} from "../common/RecipeName";
import {Translation} from "../../Translations";
import {
  AddRecipeButton,
  CheckAllButton,
  ClearAllButton,
  DoneButton, FilterIconButton,
} from "../../Constant/Buttons";
import {RecipeType} from "../../types";
import {DrawerFilters} from "./wrapper/DrawerFilters";
import {NavigationAppBar} from "./wrapper/NavigationAppBar";
import {MainNavigationMainContainer} from "./wrapper/MainNavigationMainContainer";
import {useRecipeMenuState} from "./useRecipeMenuState";
import {useElementClientHeight} from "../common/useElementClientHeight";
import {CheckedIcon, PrintIcon, UnCheckedIcon} from "../../Constant/Icons";
import i18next from "i18next";
import {CommonMenuButton} from "../common/CommonMenu";
import {useMessageSnackBar} from "../../State";
import {FLAGS} from "../../static/lib";
import {runLater} from "../../utils/Timeouts";
import {hasValue} from "typescript-nullsafe";
import {MenuListContainer} from "./wrapper/MenuListContainer";

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

export const RecipeNavigation = ({children}: {children: ReactNode}) => {
  const [recipes, actions, recipeStatus] = useRecipeMenuState();
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const snackBar = useMessageSnackBar();

  const handleDrawerClose = () => {
    setMenuOpen(false);
    runLater(actions.submit, 1);
  }

  const doPrintPreview = () => {
    try {
      window.print()
    } catch (error) {
      if (hasValue(error))
        snackBar.error(error as Error);
      else
        snackBar.error("Print error!");
    }
  }

  const [contentHeight, setHeaderElement] = useElementClientHeight();
  const [leftBottomHeight, setLeftBottomFilter] = useElementClientHeight();

  const onLangaugeChange = (language: string) => {
    i18next.changeLanguage(language, (error) => {
      if (error) snackBar.error(error).enqueue();
    }).catch(error => snackBar.error(error).enqueue());
  }

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline/>
      <NavigationAppBar position="fixed" open={isMenuOpen} width={NAVIGATION_WIDTH} ref={setHeaderElement}>
        <Toolbar>
          {isMenuOpen ? undefined :
            <>
            <Box display="flex" flexGrow={1}>
              <Badge badgeContent={recipeStatus.defaultSelected} overlap="circular" color="info">
              <FilterIconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setMenuOpen(true)}
                sx={{mr: 2}}
              />
              </Badge>
            </Box>
              <AddRecipeButton/>
              <CommonMenuButton>
                { FLAGS.map(({key, label, value}) =>
                  <MenuItem key={key}  selected={key === i18next.language}  onClick={() => onLangaugeChange(key)}>
                    <ListItemIcon><img src={value} width={20} alt={label}/></ListItemIcon>
                    <ListItemText>{label}</ListItemText>
                  </MenuItem>
                )}
                <Divider variant="middle" />
                <MenuItem onClick={doPrintPreview}>
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
        open={isMenuOpen}
      >

        <MenuListContainer bottom={leftBottomHeight}>
        <List sx={{margin: 0, padding: 0}}>
          {recipes.map((recipe) => (
            <RecipeItemName recipe={recipe.recipe} selected={recipe.selected} onChange={actions.select} key={recipe.id}/>
          ))}
        </List>
        </MenuListContainer>
        <DrawerFilters drawerWith={NAVIGATION_WIDTH} drawerHeight={contentHeight} ref={setLeftBottomFilter} direction="row" alignItems="center" justifyContent="space-between">
          <ButtonGroup variant="contained">
            <CheckAllButton disabled={recipeStatus.allSelected} onClick={actions.selectAll}/>
            <ClearAllButton disabled={recipeStatus.noneSelected} onClick={actions.selectNone}/>
          </ButtonGroup>
          <ButtonGroup variant="contained">
            <Badge badgeContent={recipeStatus.selectedAmount} overlap="circular" color={recipeStatus.hasChange ? "info" : "success" }>
              <DoneButton  onClick={handleDrawerClose} color={recipeStatus.hasChange ? "success" : "info" }/>
            </Badge>
          </ButtonGroup>
        </DrawerFilters>
      </Drawer>
      <MainNavigationMainContainer open={isMenuOpen} width={NAVIGATION_WIDTH} menuHeight={contentHeight}>{children}</MainNavigationMainContainer>
    </Box>
  );
}
