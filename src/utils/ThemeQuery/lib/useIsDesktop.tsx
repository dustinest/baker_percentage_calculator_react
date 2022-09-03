import {useTheme} from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';

export const useIsDesktop = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('sm'));
}
