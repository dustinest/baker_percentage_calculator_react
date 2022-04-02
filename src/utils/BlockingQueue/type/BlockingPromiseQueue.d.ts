export interface BlockingPromiseQueue {
    /**
     * Add to the queue and run in pipeline
     * @param callable
     */
    blockAndRun<T>(callable: () => Promise<T>): Promise<T>;

    /**
     * Wait until the queue is done and run then. This means that when blockAndRun is called then this method will postpone
     * @param callable
     */
    whenUnblocked<T>(callable: () => Promise<T>): Promise<T>;
}
