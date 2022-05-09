import {useEffect, useMemo, useRef, useState} from "react";
import { AsyncStatus } from "../type/AsyncStatus";
import {UseTimeoutAsyncProps} from "../type/UseAsyncProps";
import {AsyncStatusResult} from "../type/UseAsyncResult";
import {UseAsyncResultType} from "../type/UseAsyncResultType";
import { useAsync } from "./useAsync";

export const useTimeoutAsync = <
  ValueType extends any = any,
  ErrorType extends any = Error,
  Args extends any[] = any[]
  >
(asyncCallback: (...args: Args) => Promise<ValueType>, properties?: UseTimeoutAsyncProps) : UseAsyncResultType<ValueType, ErrorType, Args> =>
{
  const {milliseconds = 100, ...props} = properties ?? {};
  if (milliseconds <= 0) {
    throw new Error(`Ilelgal milliseconds ${milliseconds}. It should be >= 0!`);
  }
  const [asyncState, setAsyncState] = useAsync<ValueType, ErrorType, Args>(asyncCallback, props)
  const timeoutState = useRef<NodeJS.Timeout | null>(null);

  const [callback] = useState<((...args: Args) => Promise<void>) & { cancel: () => void }>(() => {
    return Object.assign(
      async (...args: Args) => {
        if (timeoutState.current !== null) {
          try {
            clearTimeout(timeoutState.current);
          } catch (e) {} // ignore errors
        }
        timeoutState.current = setTimeout(() => {
          setAsyncState(...args);
          timeoutState.current = null;
        }, milliseconds);
      },
      {
        cancel: () => {
          if (timeoutState.current !== null) {
            try {
              clearTimeout(timeoutState.current);
            } catch (e) {} // ignore errors
          }
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
  useEffect(() => { callback.cancel(); }, [callback]);

  return [
    useMemo(() => {
      if (asyncState.status === AsyncStatus.CANCELLED) {
        if (timeoutState.current !== null) {
          try {
            clearTimeout(timeoutState.current);
          } catch (e) {} // ignore errors
        }
      }
      return asyncState;
    }, [asyncState]) as AsyncStatusResult<ValueType, ErrorType>,
    callback,
  ] as const as [AsyncStatusResult<ValueType, ErrorType>, ((...args: Args) => Promise<void>) & { cancel: () => void }];
}
