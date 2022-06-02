import { ReactComponent as BakerIconSvg } from "./Graphics/baker-svgrepo-com.svg";
import {SvgIcon} from "@mui/material";
import {SvgIconProps} from "@mui/material/SvgIcon/SvgIcon";

export const BakerIcon = (props?: SvgIconProps) => {
  return <SvgIcon {...props}><BakerIconSvg/></SvgIcon>
}
