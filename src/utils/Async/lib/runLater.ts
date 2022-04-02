export const runPromiseLater = <T>(runnable: () => Promise<T>, timeout: number = 1): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        setTimeout(() => runnable().then(resolve).catch(reject), timeout);
    });
};

export const runLater = <T>(runnable: () => T, timeout:number = 1): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        setTimeout(() => {
            try {
                const result = runnable();
                resolve(result);
            } catch (e) {
                reject(e);
            }
        }, timeout);
    });
};

export const iterateLater = <T>(list: T[], runnable: (value: T, index: number) => any, timeout: number = 1): Promise<void> => {
    let index = 0;
    const _iterate = async(resolve: () => void, reject: (reason?: any) => void): Promise<void> => {
        if (index >= list.length) return resolve();
        try {
            await runnable(list[index], index);
            index++;
            if (index >= list.length) return resolve();
            // noinspection ES6MissingAwait
            runLater(() => _iterate(resolve, reject), timeout);
        } catch (e) {
            reject(e);
        }
    };
    return new Promise<void>((resolve, reject) => _iterate(resolve, reject) );
}
