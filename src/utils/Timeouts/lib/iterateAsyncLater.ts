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
      const cancel = () => {
        running = false;
        reject(new Error("Iterator cancelled!"));
      };
      //let index = -1;
      const _list = [...list];
      (async () => {
        for (let index = 0; index < _list.length; index++) {
          if (!running) return;
          if (index >= _list.length) {
            resolve();
            return;
          }
          await runLater<void>(() => runnable(_list[index], index, cancel), timeout);
        }
        if (running) resolve();
      })().catch((error) => {
        running = false;
        reject(error);
      });
    }),
    {
      cancel: () => {
        running = false;
        rejects(new Error("Iterator cancelled!"));
      }
    }
  );
}
