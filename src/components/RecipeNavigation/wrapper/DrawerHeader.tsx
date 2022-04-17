import {styled} from "@mui/material";

export const DrawerHeader = styled('div')<{width: number}>(({ theme, width }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  position: "fixed",
  top: "0px",
  left: "0px",
  width: `${width}px`,
  backgroundColor: theme.palette.background.default
}));
