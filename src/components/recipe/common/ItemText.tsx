import {Paper, styled, Typography} from "@mui/material";
import {ReactNode} from "react";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  borderRadius: 0,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderWidth: 0
}));
const BASE_CLASS_NAME = "item-text";
export const ItemText = (props: { children: ReactNode, className?: string }) => {
  const className = props.className ? `${BASE_CLASS_NAME}-${props.className}` : BASE_CLASS_NAME;
  return (<Item elevation={0} className={className}><Typography variant="body2">{props.children}</Typography></Item>)
};
