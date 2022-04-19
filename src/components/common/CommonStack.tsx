import {Stack} from "@mui/material";
import {StackProps} from "@mui/material/Stack/Stack";

export const HorizontalActionStack = (props: StackProps) => {
  return (<Stack {...props}
                 direction={props.direction || "row"}
                 justifyContent={props.justifyContent || "flex-start"}
                 alignItems={props.alignItems || "center"}
                 spacing={props.spacing || 0}
  />);
}

export const LabelAwareStack = (props: StackProps) => {
  return (<HorizontalActionStack {...props} spacing={2}/>);
}

export const VerticalStack = (props: StackProps) => {
  return (<Stack {...props}
                 direction={props.direction || "column"}
                 justifyContent={props.justifyContent || "stretch"}
                 alignItems={props.alignItems || "center"}
                 spacing={props.spacing || 0}
  />);
}
