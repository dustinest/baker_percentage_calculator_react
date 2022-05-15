import {Reducer, useEffect, useMemo, useReducer} from "react";
import {hasNoValue, hasNoValueOrEquals} from "typescript-nullsafe";
import {UseValueTrackingParams, UseValueTrackingResult} from "../type/UseValueTrackingParams";

interface ReducedState<ValueType> {
  value: ValueType;
  originalValue: ValueType;
  history: ValueType[];
  equals: boolean;
}

type Action<Action = "SET" | "RESET" | "UNDO" | "HARD_RESET"> = {
  action: Action
}

type SetAction<ValueType, ActionType = "SET" | "RESET" | "HARD_RESET"> = {
  value: ValueType
} & Action<ActionType>;

type ActonType<ValueType, SetterType, ResetType> =
  SetAction<SetterType, "SET"> |
  SetAction<ResetType, "RESET"> |
  SetAction<ValueType, "HARD_RESET"> |
  Action<"UNDO">;

const fixHistory = <ValueType>(history: ValueType[], newValue: ValueType, depth: number):ValueType[] => {
  if (history.length > 0 && hasNoValueOrEquals(newValue, history[history.length - 1])) {
    return history;
  }
  const result = [...history, ...[newValue]];
  if (result.length > depth) {
    result.shift();
  }
  return result;
}

export const useValueChange = <
  ValueType extends any = any,
  SetterType = ValueType,
  ResetType = SetterType
  >({initValue, valueParser, resetValueParser, historyDepth = 10} : UseValueTrackingParams<ValueType, SetterType, ResetType>):
  UseValueTrackingResult<ValueType, SetterType, ResetType> =>
{
  const [state, dispatch] = useReducer<Reducer<ReducedState<ValueType>, ActonType<ValueType, SetterType, ResetType>>, undefined>
  (
    (previous: ReducedState<ValueType>, action: ActonType<ValueType, SetterType, ResetType>) => {
      switch (action.action) {
        case "SET":
          const value = valueParser(action.value, previous.value, previous.originalValue);
          if (hasNoValueOrEquals(previous.value, value)) {
            return previous;
          }
          return {...previous, ...{
              value,
              equals: hasNoValueOrEquals(value, previous.originalValue),
              history: fixHistory<ValueType>(previous.history, value, historyDepth)
          }}
        case "RESET":
          const resetValue = resetValueParser ? resetValueParser(action.value, previous.value, previous.originalValue) : action.value as ValueType;
          if (hasNoValueOrEquals(previous.value, resetValue) && hasNoValueOrEquals(previous.originalValue, resetValue)) {
            return previous;
          }
          if (hasNoValueOrEquals(previous.value, resetValue)) {
            return {...previous,
              ...{
                originalValue: resetValue,
                equals: true,
              }}
          }
          if (hasNoValueOrEquals(previous.originalValue, resetValue)) {
            return {...previous,
              ...{
                value: resetValue,
                equals: true,
                history: fixHistory<ValueType>(previous.history, resetValue, historyDepth)
              }}
          }
          return {...previous,
            ...{
              value: resetValue,
              originalValue: resetValue,
              equals: true,
              history: fixHistory<ValueType>(previous.history, resetValue, historyDepth)
            }}
        case "UNDO":
          const history = [...previous.history];
          const historicValue = history.pop();
          if (hasNoValue(historicValue)) {
            return previous;
          }
          if (hasNoValueOrEquals(previous.value, historicValue)) {
            return previous;
          }
          return {...previous, ...{
              value: historicValue,
              equals: hasNoValueOrEquals(historicValue, previous.originalValue),
              history
            }}
        case "HARD_RESET":
          if (hasNoValueOrEquals(previous.value, action.value) && hasNoValueOrEquals(previous.originalValue, action.value) && previous.history.length === 1 && hasNoValueOrEquals(previous.history[0], action.value)) {
            return previous;
          }
          return {value: action.value, originalValue: action.value, history: [action.value], equals: true} as ReducedState<ValueType>
      }
    },
    void 0,
    () => ({value: initValue, originalValue: initValue, history: [initValue], equals: true} as ReducedState<ValueType>)
  );

  useEffect(() => {
    dispatch({value: initValue, action: "HARD_RESET"} as SetAction<ValueType, "HARD_RESET"> );
  }, [initValue])

  return useMemo(() => {
    return [
      state.value,
      {
        setValue: (newValue: SetterType) => dispatch({value: newValue, action: "SET"} as SetAction<SetterType, "SET"> ),
        resetValue: (newValue?: ResetType) => dispatch({value: newValue, action: "RESET"} as SetAction<ResetType, "RESET"> ),
        resetToCurrentValue: () => dispatch({value: state.value, action: "RESET"} as SetAction<ResetType, "RESET"> ),
        resetToOriginalValue: () => dispatch({value: state.originalValue, action: "RESET"} as SetAction<ResetType, "RESET"> ),
        undo: () => dispatch({action: "UNDO"} as Action<"UNDO"> ),
      },
      {
        equals: state.equals,
        original: state.originalValue,
        history: state.history
      }
    ]
  }, [state])
}



