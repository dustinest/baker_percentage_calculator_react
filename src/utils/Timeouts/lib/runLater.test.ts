import {runLater} from "./runLater";

const measure = async (callable: () => Promise<void>): Promise<number> => {
  const startTime = new Date().getTime();
  await callable();
  const endTime = new Date().getTime();
  return endTime - startTime;
};

describe("runLater works", () => {
  const mockCallback = jest.fn();
  beforeEach(() => {
    mockCallback.mockReset();
    mockCallback.mockReturnValue("abc");
  });

  it ("can be scheduled", async () => {
    const time = await measure(async () => {
      const result = await runLater(mockCallback, 100);
      expect(result).toBe("abc");
    });
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(time).toBeGreaterThan(100);
    expect(time).toBeLessThan(200);
  });

  it ("schedule immediately", async () => {
    const time = await measure(async () => {
      const result = await runLater(mockCallback);
      expect(result).toBe("abc");
    });
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(time).toBeLessThan(10);
  });

  it ("can be cancelled", async () => {
    const time = await measure(async () => {
      const result = runLater(mockCallback, 100);
      result.cancel();
      let message = "";
      try {
        await result;
      } catch (error) {
        message = (error as Error).message;
      }
      expect(message).toBe("Method cancelled!");
      // let's try again
      result.cancel();
    });
    expect(mockCallback.mock.calls.length).toBe(0);
    expect(time).toBeLessThan(10);
  });

  it ("will not be cancelled when scheduled immediately", async () => {
    const time = await measure(async () => {
      const result = runLater(mockCallback);
      result.cancel();
      await result;
      // let's try again
      result.cancel();
    });
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(time).toBeLessThan(10);
  });
});
