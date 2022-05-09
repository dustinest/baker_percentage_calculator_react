type CancellablePromise<ValueType extends any = any> = {
  cancel: () => void;
} & Promise<ValueType>;

export const runAsyncLater = <ValueType extends any = any>(
    runnable: () => Promise<ValueType>,
    timeout?: number
): CancellablePromise<ValueType> => {
  let timeoutValue: NodeJS.Timeout | null = null;
  return Object.assign(
    new Promise<ValueType>((resolve, reject) => {
      try {
        if (!timeout || timeout === 0) {
          runnable().then(resolve).catch(reject)
        } else {
          timeoutValue = setTimeout(() => runnable().then(resolve).catch(reject), timeout);
        }
      } catch (e) {
        reject(e);
      }
  }),
    {
      cancel: () => {
        if (timeoutValue === null) return;
        clearTimeout(timeoutValue);
      }
    }
  );
};

export const runLater = <ValueType extends any = any>(runnable: () => ValueType, timeout?: number): CancellablePromise<ValueType> =>
  runAsyncLater<ValueType>(async () => runnable(), timeout);

export const iterateAsync = <ValueType extends any = any>(
  list: ValueType[],
  runnable: (value: ValueType, index: number, cancel: () => void) => Promise<void>,
  timeout?: number
): CancellablePromise<void> => {
  let running = true;
  return Object.assign(
    new Promise<void>((resolve, reject) => {
      let index = -1;
      const run = () => {
        index ++;
        if (!running || index >= list.length) {
          return null;
        }
        runLater<void>(() =>
          runnable(list[index], index, () => { running = false; })
        , timeout).then(() => run()).catch(reject);
      };
      run();
    }),
    {
      cancel: () => {
        running = false;
      }
    }
  );
}

export const iterateLater = <T>(list: T[], runnable: (value: T, index: number, cancel: () => void) => any, timeout?: number): Promise<void> =>
  iterateAsync(list, async (value, index, cancel) => runnable(value, index, cancel), timeout);
