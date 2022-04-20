import {RecipeType} from "../../types";
import {useTranslation} from "../../Translations";
import {useEffect, useState} from "react";

export const useRecipeName = (name: string) => {
  const translation = useTranslation();
  const [key, setKey] = useState<[string, string]>([name, `recipe_name.${name}`]);
  useEffect(() => {
    const newKey = `recipe_name.${name}`;
    if (newKey !== key[1]) {
      setKey([name, newKey])
    }
  }, [name, key])
  const [label, setLabel] = useState<string>();
  useEffect(() => {
    const newLabel = translation(key[1]);
    const labelToChange = newLabel === key[1] ?  key[0] : newLabel
    if (label !== labelToChange) {
      setLabel(labelToChange);
    }
  }, [translation, key, label])

  return label;
}

export const RecipeName = ({recipe}: {recipe: RecipeType}) => {
  const name = useRecipeName(recipe.name);
  return (<>{name} {recipe.amount && recipe.amount > 1 ? ` x ${recipe.amount}` : undefined }</>)
}
