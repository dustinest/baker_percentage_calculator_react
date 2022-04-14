import './RecipeNavigation.css';
import {
  List,
  styled,
  Drawer,
  Typography,
  Divider,
  Box, CssBaseline, IconButton, Toolbar, ListItem, FormControlLabel, Checkbox, ButtonGroup
} from "@mui/material";

import {ChangeEvent, ReactNode, useContext, useState} from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {MenuIcon} from "../../Constant/Icons";
import {RecipesContext, RecipesStateActionTypes} from "../../State";
import {RecipeName} from "../common/RecipeName";
import {Translation} from "../../Translations";
import {CheckAllIconButton, ClearAllIconButton, DoneIconButton, PrintIconButton} from "../../Constant/Buttons";
import {runLater} from "../../utils/Async";

const drawerWidth = 240;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export const RecipeNavigation = ({children, onPrint}: {onPrint: () => void, children: ReactNode}) => {
  const [open, setOpen] = useState(false);
  const {recipeState, recipesDispatch} = useContext(RecipesContext);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>(recipeState.recipesFilter);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => {
    setOpen(false);
    runLater(() => {
      recipesDispatch({
        type: RecipesStateActionTypes.UPDATE_FILTER,
        value: selectedRecipes
      });
    }).catch(console.error);
  }

  const selectAll = () => setSelectedRecipes(recipeState.recipes.map(e => e.id));
  const selectNone = () => setSelectedRecipes([]);

  const onChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setSelectedRecipes([...selectedRecipes, ...[id]]);
    } else {
      setSelectedRecipes(selectedRecipes.filter((e) => e !== id));
    }
  }


  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline/>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{mr: 2, ...(open && {display: 'none'})}}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <Translation label="snackbar.recipes" count={recipeState.recipes.length}/>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <PrintIconButton onClick={onPrint} edge="start" color="inherit"/>
          <ButtonGroup>
            <CheckAllIconButton disabled={selectedRecipes.length === recipeState.recipes.length} onClick={selectAll}/>
            <ClearAllIconButton disabled={selectedRecipes.length === 0} onClick={selectNone}/>
          </ButtonGroup>
            <DoneIconButton onClick={handleDrawerClose}/>
        </DrawerHeader>
        <Divider/>
        <List>
          {recipeState.recipes.map((recipe) => (
            <ListItem key={recipe.id}>
              <FormControlLabel control={<Checkbox checked={selectedRecipes.includes(recipe.id)} onChange={(e) => onChange(e, recipe.id)} />} label={<RecipeName recipe={recipe}/>} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader/>
        {children}
      </Main>
    </Box>
  );
}
/*
  return (
    <><FloatingMenuOpenIconButton onClick={handleDrawerOpen}/>
    <RecipesConsumer>{(recipes) => (
      <>
        <Drawer variant="persistent"
                anchor="left"
                open={open}>
          <DrawerHeader>
            <PrintIconButton onClick={onPrint}/>
            <Typography variant="subtitle1" noWrap component="div">{translation.translatePlural("snackbar.recipes", recipes.length)}</Typography>
            <MenuCloseIconButton  onClick={handleDrawerClose}/>
          </DrawerHeader>
          <Divider />
          <List>{
            recipes.map((recipe) => (
                <ListItemButton component={Link} href={`#${recipe.id}`} key={recipe.id}>
                  <ListItemText><RecipeName recipe={recipe}/></ListItemText>
                </ListItemButton>
              )
            )
          }
          </List>
        </Drawer>
      </>
    )}</RecipesConsumer>
      {children}
    </>
  );
*/

