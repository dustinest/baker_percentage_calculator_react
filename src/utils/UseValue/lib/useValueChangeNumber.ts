import {valueOfFloat} from "typescript-nullsafe";
import {useValueChange} from "./useValueChange";
import {ChangeEvent} from "react";

export const useNumberValueTracking = (value: string | number | null | undefined, historyDepth?: number) =>
  useValueChange<number, string | number | null | undefined, string | number | null | undefined>({
      initValue: valueOfFloat(value, 0),
      valueParser: (newValue) => valueOfFloat(newValue, 0),
      resetValueParser: (newValue, oldValue) => valueOfFloat(newValue, oldValue),
      historyDepth
    }
  );

export const useNumberInputValueTracking = (value: string | number | null | undefined, historyDepth?: number) =>
  useValueChange<number, ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, string | number | null | undefined>({
      initValue: valueOfFloat(value, 0),
      valueParser: (newValue) => valueOfFloat(newValue.target.value, 0),
      resetValueParser: (newValue, oldValue) => valueOfFloat(newValue, oldValue),
      historyDepth
    }
  );
