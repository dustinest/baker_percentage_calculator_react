import {styled} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";

export const NavigationAppBar = styled(MuiAppBar)(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  top: 'auto',
  bottom: 0,
  display: 'block',
  displayPrint: 'none'
}));


