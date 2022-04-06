import {useTranslation as translationProvider} from "react-i18next";

export const useTranslation = () => {
  const translate = translationProvider();
  return {
    translate: (translation: string) => {
      return translate.t(translation);
    },
    translatePlural: (translation: string, amount?: number | undefined) => {
      if (amount !== undefined) {
        return translate.t(translation, {count: amount});
      } else {
        return translate.t(translation);
      }
    }
  }
}
