import {
  AddIcon, CloseIcon,
  DeleteIcon,
  DoneIcon,
  ExpandMoreIcon,
  MenuCloseIcon,
  MenuOpenIcon,
  PrintIcon,
  RecipeCancelIcon, RecipeEditIcon, RecipeSaveIcon
} from "./Icons";
import {Box, Button, ButtonProps, Fab, IconButton, IconButtonProps, styled} from "@mui/material";
import {Translation} from "../Translations";

const IconButtonInt = (props: IconButtonProps) => (<IconButton {...props}/>);

export const PrintIconButton = (props: IconButtonProps) => (<IconButtonInt {...props}><PrintIcon/></IconButtonInt>);
export const MenuCloseIconButton = (props: IconButtonProps) => (<IconButtonInt {...props}><MenuCloseIcon/></IconButtonInt>);
export const DeleteIconButton = (props: IconButtonProps) => (<IconButtonInt color="warning" {...props}><DeleteIcon/></IconButtonInt>);
export const DoneIconButton = (props: IconButtonProps) => (<IconButtonInt  color="success" {...props}><DoneIcon/></IconButtonInt>);

type ExpandMoreProps = { expand: boolean; } & IconButtonProps;
export const ExpandMoreIconButton = styled((props: ExpandMoreProps) => {
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

type TranslatedButtonProps = { translation: string } & ButtonProps;

const TranslatedButton = (props: TranslatedButtonProps) => {
  const {translation, ...others} = props;
  return <ButtonInt {...others}><Translation label={translation}/></ButtonInt>
}
export const TranslatedSaveButton = (props: TranslatedButtonProps) => (<TranslatedButton color="success" startIcon={<RecipeSaveIcon/>} {...props}/>);
export const TranslatedCancelButton = (props: TranslatedButtonProps) => (<TranslatedButton color="secondary" startIcon={<RecipeCancelIcon/>} {...props}/>);
export const TranslatedAddButton = (props: TranslatedButtonProps) => (<TranslatedButton color="secondary" startIcon={<AddIcon/>} {...props}/>);

export const AddButton = (props: ButtonProps) => (<ButtonInt color="success" {...props}><AddIcon/></ButtonInt>);
export const DeleteButton = (props: ButtonProps) => (<ButtonInt color="warning" {...props}><DeleteIcon/></ButtonInt>);
export const EditButton = (props: ButtonProps) => (<ButtonInt color="info" {...props}><RecipeEditIcon/></ButtonInt>);

export const AddRecipeFloatingButton = ({onClick}: {onClick: () => void}) => (
  <Box
    className="menu-trigger"
    sx={{
      position: 'fixed',
      right: 4,
      bottom: 4,
    }}><Fab color="primary" aria-label="add" onClick={onClick}><AddIcon/></Fab></Box>);

export const FloatingPrintButton = ({onClick}: {onClick: () => void}) => (
  <Box
    className="menu-trigger"
    sx={{
      position: 'fixed',
      bottom: 4,
      right: 68,
    }}><Fab color="primary" aria-label="print" onClick={onClick}><PrintIcon/></Fab></Box>);

export const FloatingPrintCancelButton = ({onClick}: {onClick: () => void}) => (
  <Box
    className="menu-trigger"
    sx={{
      position: 'fixed',
      right: 4,
      bottom: 4,
    }}><Fab color="primary" aria-label="cancel" onClick={onClick}><CloseIcon/></Fab></Box>);

export const FloatingMenuOpenIconButton = (props: IconButtonProps) => (<IconButtonInt  sx={{
  position: 'fixed',
  top: 0,
  left: 0,
}} {...props}><MenuOpenIcon/></IconButtonInt>);
