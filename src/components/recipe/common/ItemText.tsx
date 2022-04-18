import {Paper, styled, Typography} from "@mui/material";
import {ReactNode} from "react";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderWidth: 0
}));
const baseClassName = "item-text";
export const ItemText = ({ children, className }: { children: ReactNode, className?: string }) => {
  const _className = className ? `${baseClassName}-${className}` : baseClassName;
  return (<Item elevation={0} className={_className}><Typography variant="body2">{children}</Typography></Item>)
};
