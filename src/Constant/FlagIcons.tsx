import { ReactComponent as EstonianFlag } from "./flags/ee.svg";
import { ReactComponent as GBFlag } from "./flags/gb.svg";
import {SvgIcon} from "@mui/material";

export enum FlagIconType {
  ee = "ee",
  gb = "gb"
}

export const EstonianFlagIcon = () => {
  return <SvgIcon><EstonianFlag/></SvgIcon>
}

export const GBFlagIcon = () => {
  return <SvgIcon><GBFlag/></SvgIcon>
}
export const FlagIcon = ({variant}: {variant: FlagIconType}) => {
  switch (variant) {
    case FlagIconType.ee:
      return <EstonianFlagIcon/>
    case FlagIconType.gb:
      return <GBFlagIcon/>
  }
}


