import {Stack, styled} from "@mui/material";

type DrawerFiltersProps = {
  drawerWith: number;
  drawerHeight: number;
}

export const DrawerFilters = styled(Stack,
{
  shouldForwardProp: (prop) => prop !== 'drawerWith' && prop !== 'drawerHeight',
}
)<DrawerFiltersProps>(({ theme, drawerWith, drawerHeight }) => ({
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  position: "fixed",
  top: "auto",
  left: "0px",
  bottom: "0px",
  width: `${drawerWith}px`,
  height: `${drawerHeight}px`,
  backgroundColor: theme.palette.primary.main
}));
