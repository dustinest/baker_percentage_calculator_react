import {Drawer, styled} from "@mui/material";

export const NavigationDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'drawerWith',
})<{ drawerWith: number }>(({theme, drawerWith}) => ({
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: theme.spacing(drawerWith),
      boxSizing: 'border-box',
      overflowX: 'hidden'
    },
    display: 'block',
    displayPrint: 'none'
  })
);
