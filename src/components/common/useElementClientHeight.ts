import {useEffect, useState} from "react";

export const useElementClientHeight = (): [number, (ref: HTMLElement | null) => void] => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [clientHeight, setClientHeight] = useState<number>(0);

  useEffect(() => {
    if (ref) {
      setClientHeight(ref.clientHeight);
    }
  }, [ref]);

  return [clientHeight, setRef];
}
