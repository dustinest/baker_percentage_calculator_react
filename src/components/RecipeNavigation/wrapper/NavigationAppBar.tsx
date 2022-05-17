import {AppBarProps, styled} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";

type NavigationAppBarProps = {
  open: boolean;
  width: number;
} & AppBarProps;

export const NavigationAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<NavigationAppBarProps>(({ theme, open, width }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  top: 'auto',
  bottom: 0,
  /*
  ...(open && {
    width: `calc(100% - ${width}px)`,
    marginLeft: `${width}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
   */
}));
