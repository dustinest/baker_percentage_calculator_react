import {iterateLater} from "./iterateLater";

const measure = async (callable: () => Promise<void>): Promise<number> => {
  const startTime = new Date().getTime();
  await callable();
  const endTime = new Date().getTime();
  return endTime - startTime;
};

describe("iterateLater works", () => {
  it ("can be scheduled", async () => {
    const time = await measure(async () => {
      const results: string[] = [];
      await iterateLater(["ab", "cd", "ef"], (value) => { results.push(value); }, 30);
      expect(results).toStrictEqual(["ab", "cd", "ef"])
    });
    expect(time).toBeGreaterThan(89);
    expect(time).toBeLessThan(200);
  });

  it ("schedule immediately", async () => {
    const time = await measure(async () => {
      const results: string[] = [];
      await iterateLater(["ab", "cd", "ef"], (value) => { results.push(value); });
      expect(results).toStrictEqual(["ab", "cd", "ef"])
    });
    expect(time).toBeLessThan(20);
  });

  it ("can be cancelled immediately", async () => {
    const time = await measure(async () => {
      const results: string[] = [];
      const iterator = iterateLater(["ab", "cd", "ef"], (value) => { results.push(value); }, 30);
      iterator.cancel();
      let message = "";
      try {
        await iterator;
      } catch (error) {
        message = (error as Error).message;
      }
      expect(message).toBe("Iterator cancelled!");
      // let's try again
      iterator.cancel();
      expect(results.length).toBe(0);
    });
    expect(time).toBeLessThan(20);
  });

  it ("can be cancelled later", async () => {
    const time = await measure(async () => {
      const results: string[] = [];
      let message = "";
      let iterator = null;
      try {
        iterator = await iterateLater(["ab", "cd", "ef"], (value, index, cancel) => {
          if (index === 1) cancel();
          results.push(value);
        }, 30);
      } catch (error) {
        message = (error as Error).message;
      }
      expect(message).toBe("Iterator cancelled!");
      // as error was thrown the iterator does not exist!
      expect(iterator).toBeNull();
      expect(results).toStrictEqual(["ab", "cd"]);
    });
    expect(time).toBeGreaterThan(60);
    expect(time).toBeLessThan(200);
  });

  it ("might work a bit when no timeout even when cancelled", async () => {
    const time = await measure(async () => {
      const results: string[] = [];
      const iterator = iterateLater(["ab", "cd", "ef"], (value) => { results.push(value); });
      iterator.cancel();
      let message = "";
      try {
        await iterator;
      } catch (error) {
        message = (error as Error).message;
      }
      expect(message).toBe("Iterator cancelled!");
      // let's try again
      iterator.cancel();
      expect(results).toStrictEqual(["ab"]);
    });
    expect(time).toBeLessThan(20);
  });

  it ("When no timeout we can strictly say when to stop", async () => {
    const time = await measure(async () => {
      const results: string[] = [];
      let message = "";
      let iterator = null;
      try {
        iterator = await iterateLater(["ab", "cd", "ef"], (value, index, cancel) => {
          if (index === 1) cancel();
          results.push(value);
        });
      } catch (error) {
        message = (error as Error).message;
      }
      expect(message).toBe("Iterator cancelled!");
      // as error was thrown the iterator does not exist!
      expect(iterator).toBeNull();
      expect(results).toStrictEqual(["ab", "cd"]);
    });
    expect(time).toBeLessThan(20);
  });
});
