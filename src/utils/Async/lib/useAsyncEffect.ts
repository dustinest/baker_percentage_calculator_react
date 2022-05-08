import {useAsync} from "./useAsync";
import {DependencyList, useEffect} from "react";
import {ConfigurationProps} from "../type/AsyncStatus";

export function useAsyncEffect<ValueType extends any = any,
  ErrorType extends any = Error>(
  asyncCallback: () => Promise<ValueType>,
  dependencies?: DependencyList,
  props?: ConfigurationProps
) {
  const [state, callback] = useAsync<ValueType, ErrorType>(asyncCallback, props);
  // Runs the callback each time deps change
  useEffect(() => {
    callback();
    return () => {
      callback.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return state;
}
