import { BlockingPromiseQueue } from "./BlockingPromiseQueue";

describe("Blocking promise works", () => {
    it("When queue is unblocked", async () => {
        const blockingPromiseQueue = new BlockingPromiseQueue();

        const waitingResult1 = await blockingPromiseQueue.whenUnblocked(() =>
            Promise.resolve("abc")
        );
        expect(waitingResult1).toBe("abc");
        const blockingResult1 = await blockingPromiseQueue.blockAndRun(() =>
            Promise.resolve("abc")
        );
        expect(blockingResult1).toBe("abc");
        const waitingResult2 = await blockingPromiseQueue.whenUnblocked(() =>
            Promise.resolve("abc")
        );
        expect(waitingResult2).toBe("abc");
        const blockingResult2 = await blockingPromiseQueue.blockAndRun(() =>
            Promise.resolve("abc")
        );
        expect(blockingResult2).toBe("abc");
    });

    it("When queue is blocking", async () => {
        const queue = new BlockingPromiseQueue();

        const values: number[] = [];

        const blockedCall1 = queue.whenUnblocked(async () => {
            values.push(11);
        });

        queue
            .blockAndRun<number>(
                async () =>
                    new Promise<number>((resolve) =>
                        setTimeout(() => {
                            resolve(21);
                        }, 6)
                    )
            )
            .then((value) => values.push(value));

        const blockedCall2 = queue.whenUnblocked(async () => {
            values.push(12);
        });

        queue
            .blockAndRun<number>(
                async () =>
                    new Promise<number>((resolve) =>
                        setTimeout(() => {
                            resolve(22);
                        }, 4)
                    )
            )
            .then((value) => values.push(value));

        const blockedCall3 = queue.whenUnblocked(async () => {
            values.push(13);
        });

        queue
            .blockAndRun<number>(
                async () =>
                    new Promise<number>((resolve) =>
                        setTimeout(() => {
                            resolve(23);
                        }, 1)
                    )
            )
            .then((value) => values.push(value));

        const blockedCall4 = queue.whenUnblocked(async () => {
            values.push(14);
        });

        const unblockingResult = await queue.whenUnblocked<number>(async () => {
            values.push(15);
            return 16;
        });

        values.push(unblockingResult);
        await Promise.all([blockedCall1, blockedCall2, blockedCall3, blockedCall4]);
        const arrayStart = values.slice(0, 4);
        expect(arrayStart).toStrictEqual([11, 21, 22, 23]); // the end of the array might be in the random order
        expect(values.length).toBe(9);
    });
});
