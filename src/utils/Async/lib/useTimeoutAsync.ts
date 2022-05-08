import {useEffect, useMemo, useRef, useState} from "react";
import {AsyncStatus, AsyncStatusResult, TimeoutAsyncConfigurationProps, useAsync,} from "../index";

export const useTimeoutAsync = <
  ValueType extends any = any,
  ErrorType extends any = Error,
  Args extends any[] = any[]
  >
(asyncCallback: (...args: Args) => Promise<ValueType>, properties?: TimeoutAsyncConfigurationProps) : [AsyncStatusResult<ValueType, ErrorType>, ((...args: Args) => Promise<void>) & { cancel: () => void }] =>
{
  const {milliseconds = 100, ...props} = properties ?? {};
  console.log(milliseconds);
  const [asyncState, setAsyncState] = useAsync<ValueType, ErrorType, Args>(asyncCallback, props)
  const timeoutState = useRef<NodeJS.Timeout | null>(null);

  const cancelTimeout = () => {
    if (timeoutState.current === null) {
      return;
    }
    try {
      clearTimeout(timeoutState.current);
    } catch (e) {} // ignore errors
  };


  const [callback] = useState<((...args: Args) => Promise<void>) & { cancel: () => void }>(() => {
    return Object.assign(
      async (...args: Args) => {
        cancelTimeout();
        timeoutState.current = setTimeout(() => {
          setAsyncState(...args);
          timeoutState.current = null;
        }, milliseconds);
      },
      {
        cancel: () => {
          cancelTimeout();
          try {
            setAsyncState.cancel();
          } catch (e) {
            console.warn("Cancel timeout caused unexpected method cancel state", e);
          } // ignore errors
        }
      }
    ) as ((...args: Args) => Promise<void>) & { cancel: () => void };
  });
  // Cancels any pending async callbacks when the hook unmounts
  useEffect(callback.cancel, [callback]);

  return [
    useMemo(() => {
      if (asyncState.status === AsyncStatus.CANCELLED) {
        cancelTimeout();
      }
      return asyncState;
    }, [callback, asyncState]) as AsyncStatusResult<ValueType, ErrorType>,
    callback,
  ] as const as [AsyncStatusResult<ValueType, ErrorType>, ((...args: Args) => Promise<void>) & { cancel: () => void }];
}
