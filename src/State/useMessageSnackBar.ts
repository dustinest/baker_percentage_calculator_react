import {useSnackbar} from "notistack";
import {useTranslation} from "../Translations";
import {runLater} from "typescript-async-timeouts";

export type VariantType = 'default' | 'error' | 'success' | 'warning' | 'info';

export const useMessageSnackBar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const translation = useTranslation();

  const enqueue = (message: string, variant: VariantType, when?: number) => {
    if (when !== undefined && when > 0) {
      runLater(() => {
        enqueueSnackbar(message, {variant: variant});
      }, when).catch((e) => console.error("Error while working on job", e));
    } else {
      enqueueSnackbar(message, {variant: variant});
    }
    return message;
  }

  const messageProvider = (message: string, variant: VariantType) => {
    return {
      enqueue: (when?: number) => enqueue(message, variant, when),
      translate: (amount?: number) => {
        return {
          enqueue: (when?: number) => {
            const translatedMessage = translation(message, "count", amount);
            enqueue(translatedMessage, variant, when);
            return translatedMessage;
          },
        }
      }
    }
  }
  const errorMessageProvider = (error: Error | string, message: string | undefined, variant: "error" | "warning") => {
    if (variant === "warning" && message) console.warn(message, error);
    else if (variant === "warning") console.warn(error);
    if (variant === "error" && message) console.error(message, error);
    else if (variant === "error") console.error(error);
    return messageProvider(typeof error === "string" ? error as string : message ? message : error ? (error as Error).message : "Unknown warning!", variant);
  }
  return {
    info: (message: string) => messageProvider(message, "info"),
    success: (message: string) => messageProvider(message, "success"),
    error: (error: Error | string, message?: string) => errorMessageProvider(error, message, "error"),
    warn: (error: Error | string, message?: string) => errorMessageProvider(error, message, "warning")
  }
}
