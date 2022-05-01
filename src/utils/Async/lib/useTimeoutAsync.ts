import {Reducer, useReducer, useState} from "react";
import {
  AsyncStatusResult,
  TimeoutAsyncConfigurationProps,
  useAsync,
} from "../index";

const DEFAULT_PROPS = Object.freeze({milliseconds: 200, idleAsLoading: false}) as TimeoutAsyncConfigurationProps;

enum UseTimeoutMethods {
  PROPS,
  CANCEL
}

type AsyncTimeoutMethodCancel = {
  method: UseTimeoutMethods.CANCEL;
}
type AsyncTimeoutMethodProps <Args extends any[] = any[]> = {
  method: UseTimeoutMethods.PROPS;
  props: Args;
};

type AsyncTimeoutProps<Args extends any[] = any[]> = AsyncTimeoutMethodCancel | AsyncTimeoutMethodProps<Args>;

export const useTimeoutAsync = <
  ValueType extends any = any,
  ErrorType extends any = Error,
  Args extends any[] = any[]
  >
(asyncCallback: (...args: Args) => Promise<ValueType>, properties?: TimeoutAsyncConfigurationProps) : [AsyncStatusResult<ValueType, ErrorType>, ((...args: Args) => Promise<void>) & { cancel: () => void }] =>
{
  const {milliseconds, ...props} = properties ? {...DEFAULT_PROPS, ...properties} : DEFAULT_PROPS;
  const [asyncState, setAsyncState] = useAsync<ValueType, ErrorType, Args>(asyncCallback, props)
  // noinspection JSUnusedLocalSymbols
  const timeoutStatus = useReducer<Reducer<NodeJS.Timeout | null, AsyncTimeoutProps<Args>>>(
    (previous, action) => {
      if (previous !== null) {
        try {
          clearTimeout(previous);
        } catch (e) {} // ignore errors
      }
      if (action.method === UseTimeoutMethods.PROPS) {
        return setTimeout(() => setAsyncState(...action.props), milliseconds)
      } else {
        setAsyncState.cancel();
      }
      return null;
    },
    null
  );

  const [callback] = useState<((...args: Args) => Promise<void>) & { cancel: () => void }>(() => {
    return Object.assign(
      async (...args: Args) => timeoutStatus[1]({method: UseTimeoutMethods.PROPS, props: args}),
      {
        cancel: () => timeoutStatus[1]({method: UseTimeoutMethods.CANCEL})
      }
    ) as ((...args: Args) => Promise<void>) & { cancel: () => void };
  });


  return [asyncState, callback];
}
