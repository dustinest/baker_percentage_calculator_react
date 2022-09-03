import {styled} from "@mui/material";
import {ReactNode} from "react";
import {useIsDesktop} from "../../../utils/ThemeQuery/lib/useIsDesktop";

type MainNavigationContainerProps = {
  isDesktop: boolean;
  height: number;
}
const MainNavigationContainer = styled('main', {shouldForwardProp: (prop) => prop !== 'isDesktop' && prop !== 'height'})<
  MainNavigationContainerProps>((
    {
      theme,
      height,
      isDesktop
    }) => ({
  flexGrow: 1,
  padding: isDesktop ? theme.spacing(3) : 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginBottom: `${height}px`,
  overflow: "hidden",
}));

type MainNavigationMainContainerProps = {
  children: ReactNode;
  menuHeight: number;
}

export const MainNavigationMainContainer = ({children, menuHeight}: MainNavigationMainContainerProps) => {
  const isDesktop = useIsDesktop();
  return (
    <MainNavigationContainer height={menuHeight} isDesktop={isDesktop}>
      {children}
    </MainNavigationContainer>
  );
}
