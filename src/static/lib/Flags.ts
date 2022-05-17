// noinspection ES6PreferShortImport
import {Locales} from "./Locales.d";
import {FlagIconType} from "../../Constant/FlagIcons";

export type FlagType = {
  key: string;
  label: string;
  icon: FlagIconType
}

export const FLAGS = [
  {
    key: "ee",
    label: Locales.ee,
    icon: FlagIconType.ee
  } as FlagType,
  {
    key: "gb",
    label: Locales.gb,
    icon: FlagIconType.gb
  } as FlagType
] as FlagType[]
