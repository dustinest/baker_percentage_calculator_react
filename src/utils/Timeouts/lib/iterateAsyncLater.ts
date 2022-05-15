import {CancellablePromise} from "../type/CancellablePromise";
import {runLater} from "./runLater";

export const iterateAsyncLater = <ValueType extends any = any>(
  list: ValueType[],
  runnable: (value: ValueType, index: number, cancel: () => void) => Promise<void>,
  timeout?: number
): CancellablePromise<void> => {
  let running = true;
  let rejects: (reason?: any) => void | null = () => {};
  return Object.assign(
    new Promise<void>((resolve, reject) => {
      rejects = reject;
      let index = -1;
      const run = () => {
        index ++;
        if (!running || index >= list.length) {
          if (running) resolve();
          return;
        }
        runLater<void>(() =>
            runnable(list[index], index, () => {
              running = false;
              reject(new Error("Iterator cancelled!"));
            })
          , timeout).then(() => run()).catch(reject);
      };
      run();
    }),
    {
      cancel: () => {
        running = false;
        rejects(new Error("Iterator cancelled!"));
      }
    }
  );
}
