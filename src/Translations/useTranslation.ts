import {useTranslation as translationProvider} from "react-i18next";
import {hasValue} from "../utils/NullSafe";

export const useTranslation = () => {
  const translate = translationProvider();
  return (label: string, ...args: (string | number | undefined | null)[]): string => {
    const props: { [key: string]: number | string } = {};
    for (let i = 0; i < args.length; i+=1) {
      const key = args[i];
      const value = args[i+1];
      if (!hasValue(key) || typeof key !== "string") {
        throw new Error("The type of key must be string!");
      }
      if (hasValue(value)) {
        props[key] = value;
      }
    }
    return translate.t(label, props);
  }
}
