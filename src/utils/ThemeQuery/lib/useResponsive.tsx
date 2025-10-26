import {UserResponsiveBetween, UserResponsiveDown, UserResponsiveOnly, UserResponsiveUp} from "../type/ThemeQueryType";
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Breakpoints} from "@mui/system";
import {hasValue} from "typescript-nullsafe";

type ResponsivePropsType = UserResponsiveBetween | UserResponsiveUp | UserResponsiveDown | UserResponsiveOnly;

const getMediaQuery = (breakpoints: Breakpoints, param: ResponsivePropsType): string => {
  const {up} = param as UserResponsiveUp;
  if (hasValue(up)) {
    return breakpoints.up(up);
  }
  const {down} = param as UserResponsiveDown;
  if (hasValue(down)) {
    return breakpoints.down(down);
  }
  const {only} = param as UserResponsiveOnly;
  if (hasValue(only)) {
    return breakpoints.only(only);
  }
  const {start, end} = param as UserResponsiveBetween;
  if (hasValue(start) && hasValue(end)) {
    return breakpoints.between(start, end);
  }
  throw new Error("Illegal argument " + param + "!");
}

export const useResponsive = (param: ResponsivePropsType): boolean => {
  const theme = useTheme();
  return useMediaQuery(getMediaQuery(theme.breakpoints, param));
}
