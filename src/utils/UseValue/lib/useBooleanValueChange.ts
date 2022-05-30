import {hasValue} from "typescript-nullsafe";
import {useValueChange} from "./useValueChange";
import {ChangeEvent} from "react";

export const useBooleanValueChange = (value: boolean | null | undefined, historyDepth?: number) =>
  useValueChange<boolean, string | boolean | null | undefined, boolean | null | undefined>({
      initValue: value === true,
      valueParser: (newValue) => newValue === true,
      resetValueParser: (newValue, oldValue) => hasValue(newValue) ? newValue : oldValue,
      historyDepth
    }
  );

export const useBooleanInputValueChange = (value: boolean | null | undefined, historyDepth?: number) =>
  useValueChange<boolean, ChangeEvent<HTMLInputElement>, boolean | null | undefined>({
      initValue: value === true,
      valueParser: (newValue) => newValue.target.checked,
      resetValueParser: (newValue, oldValue) => hasValue(newValue) ? newValue : oldValue,
      historyDepth
    }
  );
