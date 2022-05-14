import {useEffect, useRef} from "react";

export const useLatestCallback = <T extends any>(currentCallback: T) => {
  const callback = useRef(currentCallback)
  useEffect(() => {
    callback.current = currentCallback
  })
  return callback
}
