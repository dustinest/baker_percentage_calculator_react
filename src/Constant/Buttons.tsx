import {
  AddIcon,
  CheckAllCheckboxIcon,
  ClearAllCheckboxIcon,
  DeleteIcon,
  DoneIcon,
  EditIcon,
  ExpandMoreIcon,
  InfoIcon,
  MenuIcon,
  MoreVertIcon,
  PercentGlobalIcon,
  PercentIcon,
  ResetIcon,
  WeightIcon
} from "./Icons";
import {Box, Button, ButtonProps, Fab, IconButton, IconButtonProps, styled} from "@mui/material";
import {Translation} from "../Translations";
import {useRecipeEditService} from "../service/RecipeEditService";

const IconButtonInt = (props: IconButtonProps) => (<IconButton {...props}/>);

export const MenuIconButton = (props: IconButtonProps) => (<IconButtonInt {...props}><MenuIcon/></IconButtonInt>);
export const DeleteIconButton = (props: IconButtonProps) => (
  <IconButtonInt color="warning" {...props}><DeleteIcon/></IconButtonInt>);
export const DoneIconButton = (props: IconButtonProps) => (
  <IconButtonInt color="success" {...props}><DoneIcon/></IconButtonInt>);
export const MoreIconButton = (props: IconButtonProps) => (<IconButtonInt {...props}><MoreVertIcon/></IconButtonInt>);
export const InfoIconButton = (props: IconButtonProps) => (<IconButtonInt {...props}><InfoIcon/></IconButtonInt>);

export const WeightIconButton = (props: IconButtonProps) => (
  <IconButtonInt {...props}><WeightIcon fontSize="small"/></IconButtonInt>);
export const PercentIconButton = (props: IconButtonProps) => (
  <IconButtonInt {...props}><PercentIcon fontSize="small"/></IconButtonInt>);
export const PercentIconGlobalButton = (props: IconButtonProps) => (
  <IconButtonInt {...props}><PercentGlobalIcon fontSize="small"/></IconButtonInt>);


export const ExpandMoreIconButton = styled((props: { expand: boolean; } & IconButtonProps) => {
  const {expand, ...other} = props;
  return <IconButton {...other} ><ExpandMoreIcon/></IconButton>;
})(({theme, expand}) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ButtonInt = (props: ButtonProps) => (<Button {...props}/>);

const TranslatedButton = (props: { translation: string } & ButtonProps) => {
  const {translation, ...others} = props;
  return <ButtonInt {...others}><Translation label={translation}/></ButtonInt>
}
export const TranslatedSaveButton = (props: ButtonProps) => (
  <TranslatedButton color="success" translation="actions.save" {...props}/>);
export const TranslatedCancelButton = (props: ButtonProps) => (
  <TranslatedButton color="secondary" translation="actions.cancel" {...props}/>);
export const TranslatedChangeButton = (props: ButtonProps) => (
  <TranslatedButton color="secondary" translation="actions.change" {...props}/>);
export const EditLabelIconButton = (props: ButtonProps) => (
  <ButtonInt color="success" {...props} endIcon={<EditIcon/>}/>);

export const TranslatedAddIconButton = (props: { translation: string } & ButtonProps) => (
  <TranslatedButton color="secondary" startIcon={<AddIcon/>} {...props}/>);

export const AddButton = (props: ButtonProps) => (<ButtonInt color="success" {...props}><AddIcon/></ButtonInt>);
export const DeleteButton = (props: ButtonProps) => (<ButtonInt color="warning" {...props}><DeleteIcon/></ButtonInt>);
export const DoneButton = (props: ButtonProps) => (<ButtonInt color="success" {...props}><DoneIcon/></ButtonInt>);
export const ResetButton = (props: ButtonProps) => (<ButtonInt color="warning" {...props}><ResetIcon/></ButtonInt>);

export const CheckAllButton = (props: ButtonProps) => (
  <ButtonInt color="success" {...props}><CheckAllCheckboxIcon/></ButtonInt>);
export const ClearAllButton = (props: ButtonProps) => (
  <ButtonInt color="success" {...props}><ClearAllCheckboxIcon/></ButtonInt>);

const MenuTriggerBox = styled(Box)({
  position: 'fixed',
  right: 4,
  bottom: 4,
})

export const AddRecipeFloatingButton = () => {
  const {editRecipeMethods} = useRecipeEditService();
  return (
    <MenuTriggerBox className="menu-trigger">
      <Fab color="primary" aria-label="add" onClick={editRecipeMethods.create}><AddIcon/></Fab></MenuTriggerBox>);
}
