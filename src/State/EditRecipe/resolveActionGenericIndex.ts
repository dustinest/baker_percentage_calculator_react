import {RecipeType} from "../../types";

export const resolveActionGenericIndex = <T>(index: T | number, callback1: (index: number) => RecipeType | null, callback2: (index: T) => RecipeType | null) => {
  if (typeof index === "number") {
    return callback1(index as number);
  }
  return callback2(index as T);
}
