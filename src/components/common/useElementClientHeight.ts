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

export const useElementClientSize = (): [{ width: number, height: number }, (ref: HTMLElement | null) => void] => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const clientHeight = useMemo<{ width: number, height: number }>(() => {
    if (ref) {
      return {width: ref.clientWidth, height: ref.clientHeight};
    }
    return {width: 0, height: 0};
  }, [ref]);
  return [clientHeight, setRef];
}
