import {useMemo, useState} from "react";

export const useElementClientHeight = (): [number, (ref: HTMLElement | null) => void] => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const clientHeight = useMemo<number>(() => {
    if (ref) {
      return ref.clientHeight;
    }
    return 0;
  }, [ref]);
  return [clientHeight, setRef];
}
