import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";
import {Typography} from "@mui/material";
import {BakerPercentage} from "../BakerPercentage";

export const MicroNutrients = ({microNutrients}: {microNutrients: BakerPercentageResult}) => {
  return (<Typography variant="body1" className="baker-percentage" component="div"><BakerPercentage microNutrientsResult={microNutrients.microNutrients}/></Typography>)
}
