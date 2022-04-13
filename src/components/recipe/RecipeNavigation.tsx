import './RecipeNavigation.css';
import {Link, List, ListItemText, ListItemButton} from "@mui/material";
import {RecipesConsumer, useMessageSnackBar} from "../../State";
import {MenuCollapsable} from "../containers/MenuCollapsable";
import {useTranslation} from "../../Translations";
import {useEffect, useState} from "react";
import {RIconButton} from "../common/RButton";
import {InfoIcon} from "../common/Icons";
import {RecipeName} from "../common/RecipeName";

export const RenderInfoIcon = ({amount}: { amount: number }) => {
  const snackBar = useMessageSnackBar();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!snackBar) return; // TODO: this might bite our asses
    if (amount <= 0) {
      setMessage(snackBar.info("No messages found!").translate().enqueue());
    } else {
      setMessage([
        snackBar.success("snackbar.recipes").translate(amount).enqueue(),
        snackBar.info("snackbar.print_pages").translate(Math.floor(amount / 2)).enqueue(100)
      ].join(". "));
    }
    // eslint-disable-next-line
  }, [amount])

  const showRecipeSnackbar = () => {
    snackBar.info(message).enqueue();
  }
  return (<RIconButton className="menu-trigger" onClick={showRecipeSnackbar} icon={<InfoIcon/>} label="Info" sx={{
      position: 'fixed',
      left: 0,
      bottom: 0,
    }}/>
  )
}
export const RecipeNavigation = () => {
  const translation = useTranslation();
  return (
    <RecipesConsumer>{(recipes) => (<>
      <RenderInfoIcon amount={recipes.length}/>
      <MenuCollapsable title={translation.translatePlural("snackbar.recipes", recipes.length)}>
        <List>{
          recipes.map((recipe) => (
              <ListItemButton component={Link} href={`#${recipe.id}`} key={recipe.id}>
                <ListItemText><RecipeName recipe={recipe}/></ListItemText>
              </ListItemButton>
            )
          )
        }
        </List>
      </MenuCollapsable>
    </>)
    }</RecipesConsumer>
  );
}
