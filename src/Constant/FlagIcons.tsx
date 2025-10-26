import EstonianFlag from "./flags/ee.svg?react";
import GBFlag from "./flags/gb.svg?react";
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


