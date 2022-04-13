import {IconButton, IconButtonProps, styled} from "@mui/material";
import {useEffect, useState} from "react";
import { ExpandMoreIcon } from "./Icons";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
const ExpandMoreButton = styled((props: ExpandMoreProps) => {
  const {expand, ...other} = props;
  return <IconButton {...other} />;
})(({theme, expand}) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const ExpandMoreAction = ({expanded, onChange}: { expanded: boolean, onChange: (expanded: boolean) => void }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded);
  useEffect(() => {
    if (expanded !== isExpanded) {
      onChange(isExpanded);
    }
  }, [expanded, isExpanded, onChange])

  return (<ExpandMoreButton
      expand={expanded}
      onClick={() => setIsExpanded(!expanded)}
      aria-expanded={expanded}
      aria-label="show more"
    >
      <ExpandMoreIcon/>
    </ExpandMoreButton>
  )
}
