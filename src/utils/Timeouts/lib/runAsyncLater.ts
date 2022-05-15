import {CancellablePromise} from "../type/CancellablePromise";

export const runAsyncLater = <ValueType extends any = any>(
  runnable: () => Promise<ValueType>,
  timeout?: number
): CancellablePromise<ValueType> => {
  let timeoutValue: NodeJS.Timeout | null = null;
  let rejects: (reason?: any) => void | null = () => {};

  const result = new Promise<ValueType>((resolve, reject) => {
    rejects = reject;
    try {
      if (!timeout || timeout === 0) {
        runnable().then(resolve).catch(reject)
      } else {
        timeoutValue = setTimeout(() => runnable().then((result) => {
          if (timeoutValue === null) return;
          resolve(result);
        }).catch((error) => {
          if (timeoutValue === null) return;
          reject(error);
        }), timeout);
      }
    } catch (e) {
      reject(e);
    }
  });
  return Object.assign(result, {
      cancel: () => {
        if (timeoutValue === null) return;
        clearTimeout(timeoutValue);
        timeoutValue = null;
        rejects(new Error("Method cancelled!"));
      }
    }
  );
};
