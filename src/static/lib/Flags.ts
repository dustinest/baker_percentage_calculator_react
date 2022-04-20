// noinspection ES6PreferShortImport
import {Locales} from "./Locales.d";
import gb from '../svg/flags/gb.svg';
import ee from '../svg/flags/ee.svg';

export type FlagType = {
  key: string;
  label: string;
  value: string;
}

export const FLAGS = [
  {
    key: "ee",
    label: Locales.ee,
    value: ee
  } as FlagType,
  {
    key: "gb",
    label: Locales.gb,
    value: gb
  } as FlagType
] as FlagType[]
