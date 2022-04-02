import {BlockingPromiseQueue} from "../type/BlockingPromiseQueue.d";

const generateToken = (): string => {
    const startStr = Date.now().toString();
    const endStr = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return `${startStr}-${endStr}`;
};

export class BlockingPromiseQueueImpl implements BlockingPromiseQueue {
    private blockingQueue: string[] = [];

    private waitQueueEnd(token: string | null): Promise<void> {
        if (this.blockingQueue.length === 0) return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
            const resolveInner = () => {
                if (
                    (token === null && this.blockingQueue.length === 0) ||
                    (token !== null &&
                        (this.blockingQueue.length === 0 ||
                            this.blockingQueue[0] === token))
                ) {
                    try {
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    setTimeout(resolveInner, 1);
                }
            };
            resolveInner();
        });
    }

    public blockAndRun<T>(callable: () => Promise<T>): Promise<T> {
        const token = generateToken();
        this.blockingQueue.push(token);
        return new Promise<T>((resolve, reject) => {
            this.waitQueueEnd(token)
                .then(() => callable().then(resolve).catch(reject))
                .catch(reject)
                .finally(() => {
                    const index = this.blockingQueue.indexOf(token);
                    this.blockingQueue.splice(index, 1);
                });
        });
    }

    public whenUnblocked<T>(callable: () => Promise<T>): Promise<T> {
        return this.waitQueueEnd(null).then(callable);
    }
}

export const newBlockingPromiseQueue = (): BlockingPromiseQueue => new BlockingPromiseQueueImpl();
