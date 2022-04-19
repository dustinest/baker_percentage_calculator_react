import {RecipeType} from "../../../types";
import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";
import {useEffect, useState} from "react";
import {AsyncStatus, useAsyncEffect} from "../../../utils/Async";
import {hasValue} from "../../../utils/NullSafe";
import {recalculateRecipeBakerPercentage} from "../common/RecipeItemEditService";
import {useMessageSnackBar} from "../../../State";

type UseBakerPercentageResultNoValue = {
  hasValue: false;
  recipeResult: undefined;
  bakerPercentage: undefined;
}
const staticUseBakerPercentageResultNoValue = Object.freeze({ hasValue: false, recipeResult: undefined, bakerPercentage: undefined }) as UseBakerPercentageResultNoValue;
type UseBakerPercentageResultSuccess = {
  hasValue: true;
  recipeResult: RecipeType;
  bakerPercentage: BakerPercentageResult;
}
type UseBakerPercentageResult = UseBakerPercentageResultSuccess | UseBakerPercentageResultNoValue;

const getRecipePercentage = async (recipe: RecipeType | null | undefined): Promise<UseBakerPercentageResult> => {
  if (hasValue(recipe)) {
    const bakerPercentage = await recalculateRecipeBakerPercentage(recipe);
    if (bakerPercentage.ingredients.find(e => e.ingredients.find(i => i.grams > 0))) {
      return {recipeResult: recipe, bakerPercentage, hasValue: true};
    }
  }
  return staticUseBakerPercentageResultNoValue;
}

export const useBakerPercentage = (recipe: RecipeType | null | undefined): UseBakerPercentageResult => {
  const snackBar = useMessageSnackBar();
  const [data, setData] = useState<UseBakerPercentageResult>(staticUseBakerPercentageResultNoValue);
  const result = useAsyncEffect<UseBakerPercentageResult>(async ()  => getRecipePercentage(recipe), [recipe]);

  useEffect(() => {
    if (result.status === AsyncStatus.SUCCESS) {
      if (!result.value.hasValue && !data.hasValue) {
        return;
      }
      setData(result.value);
    } else if (result.status === AsyncStatus.ERROR) {
      snackBar.error(result.error, "Error while reading calculating the baker percentage!").translate().enqueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  return data;
}
