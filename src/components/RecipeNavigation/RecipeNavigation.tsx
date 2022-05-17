import './RecipeNavigation.css';
import {
  Badge,
  Box, Button,
  ButtonGroup,
  CssBaseline,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import {ReactNode, useState} from "react";
import {RecipeName} from "../common/RecipeName";
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
import {useMessageSnackBar} from "../../State";
import {FLAGS} from "../../static/lib";
import {runLater} from "../../utils/Timeouts";
import {hasValue} from "typescript-nullsafe";
import {MenuHeaderContainer} from "./wrapper/MenuHeaderContainer";
import {NavigationDrawer} from "../recipe/RecipeItem/NavigationDrawer";
import {MenuListContainer} from "./wrapper/MenuListContainer";
import {FlagIcon} from "../../Constant/FlagIcons";

const NAVIGATION_WIDTH = 35

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
              <IconButton color="inherit" onClick={doPrintPreview}><PrintIcon/></IconButton>
            </>
          }
        </Toolbar>
      </NavigationAppBar>
      <NavigationDrawer
        drawerWith={NAVIGATION_WIDTH}
        variant="persistent"
        anchor="left"
        open={isMenuOpen}
      >
        <MenuHeaderContainer bottom={leftBottomHeight}>
          <ButtonGroup variant="contained">
            { FLAGS.map(({key, label, icon}) =>
              <Button key={key}
                      disabled={key === i18next.language}
                      onClick={() => onLangaugeChange(key)}
                      endIcon={<FlagIcon variant={icon}/>}
                      >{label}</Button>
            )}
          </ButtonGroup>
          <MenuListContainer>
            {recipes.map((recipe) => (
              <RecipeItemName recipe={recipe.recipe} selected={recipe.selected} onChange={actions.select} key={recipe.id}/>
            ))}
          </MenuListContainer>
        </MenuHeaderContainer>
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
      </NavigationDrawer>
      <MainNavigationMainContainer open={isMenuOpen} width={NAVIGATION_WIDTH} menuHeight={contentHeight}>{children}</MainNavigationMainContainer>
    </Box>
  );
}
