import {styled} from "@mui/material";
import {ReactNode} from "react";

type MainNavigationContainerProps = {
  open: boolean;
  width: number;
  height: number;
}
const MainNavigationContainer = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<
  MainNavigationContainerProps>((
    {
      theme,
      open,
      width,
      height
    }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${width}px`,
  marginBottom: `${height}px`,
  overflow: "hidden",
  /*
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),

   */
}));

type MainNavigationMainContainerProps = {
  open: boolean;
  width: number;
  children: ReactNode;
  menuHeight: number;
}

export const MainNavigationMainContainer = ({open, width, children, menuHeight}: MainNavigationMainContainerProps) => {
  return (
    <MainNavigationContainer open={open} width={width} height={menuHeight}>
      {children}
    </MainNavigationContainer>
  );
}
