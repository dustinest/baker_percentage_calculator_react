export enum UseRecipeTypeStatus {
  ERROR = "ERROR",
  WAITING = "WAITING",
  DONE = "DONE",
  RESULT = "RESULT"
}

export type UseRecipeTypeError = UseRecipeTypeResult<UseRecipeTypeStatus.ERROR>;
export type UseRecipeTypeWaiting = UseRecipeTypeResult<UseRecipeTypeStatus.WAITING>;
export type UseRecipeTypeDone = UseRecipeTypeResult<UseRecipeTypeStatus.DONE>;
export type UseRecipeTypeResult  = UseRecipeTypeResult<UseRecipeTypeStatus.RESULT>;

export type CommonUseRecipeTypeResult = UseRecipeTypeError | UseRecipeTypeWaiting | UseRecipeTypeDone;
