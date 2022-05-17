import {Drawer, styled} from "@mui/material";

export const NavigationDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'drawerWith',
})<{ drawerWith: number }>(({theme, drawerWith}) => {
    const width = theme.spacing(drawerWith);
    return {
      width,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width,
        boxSizing: 'border-box',
        overflowX: 'hidden'
      },
    };
  }
);
