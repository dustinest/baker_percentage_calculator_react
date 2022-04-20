import {AddRecipeFloatingButton} from "../Constant/Buttons";
import {useRecipeEditService} from "../service/RecipeEditService";


export const AddRecipeIcon = () => {
  const {editRecipeMethods} =  useRecipeEditService();
  return (<AddRecipeFloatingButton onClick={editRecipeMethods.create}/>);
};
