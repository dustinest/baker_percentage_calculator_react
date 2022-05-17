import {Stack, styled} from "@mui/material";

type DrawerFiltersProps = {
  drawerWith: number;
  drawerHeight: number;
}

export const DrawerFilters = styled(Stack,
{
  shouldForwardProp: (prop) => prop !== 'drawerWith' && prop !== 'drawerHeight',
}
)<DrawerFiltersProps>(({ theme, drawerWith, drawerHeight }) => {
  const padding = theme.spacing(0, 1);
  const margin = theme.spacing(0, 0);
  const width = theme.spacing(drawerWith);
  return {
    padding: padding,
    margin: margin,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    position: "absolute",
    top: "auto",
    left: "0px",
    bottom: "0px",
    width: width,
    height: `${drawerHeight}px`,
    backgroundColor: theme.palette.primary.main
  };
});
