import {Grid} from "@mui/material";
import {GridProps} from "@mui/material/Grid/Grid";

type GridContainerProps = {
} & GridProps;

export const GridContainer = (props: GridContainerProps) => {
  return (<Grid container {...props} spacing={props.spacing || 2} justifyContent={ props.justifyContent || "center"} alignItems={ props.alignItems || "flex-start"}/>);
}
export const GridItem = (props: GridContainerProps) => {
  return (<Grid item {...props}/>);
}
