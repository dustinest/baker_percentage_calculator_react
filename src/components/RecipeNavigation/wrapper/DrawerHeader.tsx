import {Stack, styled} from "@mui/material";

export const DrawerHeader = styled(Stack)<{width: number, height: number}>(({ theme, width, height }) => ({
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  position: "fixed",
  top: "auto",
  left: "0px",
  bottom: 0,
  width: `${width}px`,
  height: `${height}px`,
  backgroundColor: theme.palette.background.default
}));
