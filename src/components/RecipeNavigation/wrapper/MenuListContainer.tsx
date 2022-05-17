import {styled} from "@mui/material";

export const MenuListContainer = styled('div')<{bottom: number}>(({ theme, bottom }) => ({
  padding: theme.spacing(0, 0),
  margin: theme.spacing(0, 0),
  position: "absolute",
  top: 0,
  left: 0,
  bottom:`${bottom}px`,
  width: '100%',
  overflow: "auto"
}));
