import {valueOf} from "typescript-nullsafe";
import {useValueChange} from "./useValueChange";
import {ChangeEvent} from "react";

export const useStringValueTracking = (value: string | null | undefined, historyDepth?: number) =>
  useValueChange<string, string | null | undefined, string | null | undefined>({
      initValue: valueOf(value, ""),
      valueParser: (newValue) => valueOf(newValue, ""),
      resetValueParser: (newValue, oldValue) => valueOf(newValue, oldValue),
      historyDepth
    }
  );

export const useStringInputValueTracking = (value: string | null | undefined, historyDepth?: number) =>
  useValueChange<string, ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, string | null | undefined>({
      initValue: valueOf(value, ""),
      valueParser: (newValue) => valueOf(newValue.target.value, ""),
      resetValueParser: (newValue, oldValue) => valueOf(newValue, oldValue),
      historyDepth
    }
  );
