import {BakerPercentageAwareRecipe} from "./index";
import {HorizontalActionStack, VerticalStack} from "../../../common/CommonStack";
import {Divider, Table, TableBody, TableCell, TableRow} from "@mui/material";
import {ItemText} from "../ItemText";
import {Translation} from "../../../../Translations";
import {getRecipePortions, RecipePortion} from "./RecipePortionsCalculator";
import {useMemo} from "react";
import {hasValue} from "typescript-nullsafe";

type RecipeTotal = {
  id: string;
  label: string;
  portions: RecipePortion[];
};

type RecipeTotals = {
  horizontalValues: number;
  totals: RecipeTotal[];
  grand_total?: RecipeTotal;
};

const RenderPortionItem = ({amount, portion}: {amount: number, portion: RecipePortion}) => {
  return (<ItemText className="totals">{amount !== portion.amount ? `${portion.label} = ` : undefined}{portion.grams} g</ItemText>)
}

const RenderTotalAmount = ({portions, label, amount}: { portions: RecipePortion[], label: string, amount:number }) => {
  return (<>
      <HorizontalActionStack justifyContent="center" alignItems="baseline"
                             spacing={0}>
        <ItemText><Translation label={label}/></ItemText>
        <HorizontalActionStack justifyContent="center" alignItems="baseline"
                               divider={<Divider orientation="vertical" flexItem/>}
                               spacing={0.5}>
        {portions.map((p, index) => <RenderPortionItem key={index} portion={p} amount={amount}/>)}
        </HorizontalActionStack>
    </HorizontalActionStack>
  </>)
}

const RenderTotalsAsTableRow = ({portions, label, amount}: { portions: RecipePortion[], label: string, amount:number }) => {
  return (<TableRow>
    <TableCell><Translation label={label}/></TableCell>
    {portions.map((portion, portionIndex) => <TableCell key={portionIndex}><RenderPortionItem portion={portion} amount={amount}/></TableCell>)}
  </TableRow>)
}

export const RecipeGrandTotal = ({recipe}: { recipe: BakerPercentageAwareRecipe }) => {
  const values = useMemo<RecipeTotals>(() => {
    const result: RecipeTotals = {
      horizontalValues: 0,
      totals: []
    };
    if (recipe.totalWeight.total <= 0) return result;
    if (recipe.totalWeight.dough > 0 && recipe.totalWeight.total !== recipe.totalWeight.dough) {
      const name = recipe.bakerPercentage.ingredients.length > 1 ? recipe.bakerPercentage.ingredients[1].name : undefined;
      result.totals.push({
        id: "dough",
        label: hasValue(name) && name.trim().length > 0 ? name : "totals.dough",
        portions: getRecipePortions(recipe.totalWeight.dough, recipe.amount)
      });
    }
    if (recipe.totalWeight.others > 0 && recipe.totalWeight.total !== recipe.totalWeight.others) {
      const name = recipe.bakerPercentage.ingredients.map((value, index) => index > 1 ? value.name : null).find((value) => hasValue(value));
      result.totals.push({
        id: "other",
        label: hasValue(name) && name.trim().length > 0 ? name : "totals.other",
        portions: getRecipePortions(recipe.totalWeight.others, recipe.amount)
      });
    }
    result.grand_total = {
      id: "total",
      label: "totals.total",
      portions: getRecipePortions(recipe.totalWeight.total, recipe.amount)
    };
    result.horizontalValues = Math.max(result.totals.reduce((result, value) => Math.max(result, value.portions.length), 0), result.grand_total.portions.length);

    return result;
  }, [recipe.totalWeight, recipe.amount, recipe.bakerPercentage]);

  if (hasValue(values.grand_total) && values.totals.length > 0 && values.horizontalValues > 1) {
    return (
      <Table>
        <TableBody>
          {values.totals.map((total, totalIndex) => <RenderTotalsAsTableRow key={totalIndex} {...total} amount={recipe.amount}/>)}
          <RenderTotalsAsTableRow {...values.grand_total} amount={recipe.amount}/>
        </TableBody>
      </Table>
    )
  } else {
      return (<VerticalStack
          divider={<Divider orientation="horizontal" flexItem/>}
          spacing={0.5}
        >
        {values.totals.length > 0 ?
          <HorizontalActionStack justifyContent="center" alignItems="baseline" divider={<Divider orientation="vertical" flexItem/>} spacing={0.5}>
            {values.totals.map(({id, ...others}) => <RenderTotalAmount key={id} {...others} amount={recipe.amount}/>)}
          </HorizontalActionStack>
          : undefined }
        {values.grand_total ? <RenderTotalAmount {...values.grand_total} amount={recipe.amount}/> : undefined }
        </VerticalStack>
      )
  }
}
