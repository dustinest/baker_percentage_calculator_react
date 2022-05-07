import {renderHook, act} from '@testing-library/react-hooks'
import {useAsync} from "./useAsync";
import {
  AsyncResulCancelled,
  AsyncResulSuccess,
  AsyncResultLoading,
  AsyncStatus,
  AsyncStatusResult,
  ConfigurationProps
} from "../type/AsyncStatus";

beforeAll(jest.useFakeTimers);
afterAll(jest.useRealTimers);

const resolveLoading = (result: AsyncStatusResult<boolean>): [{ status: AsyncStatus.LOADING; }, () => void] => {
  const {cancel, ...status} = result as AsyncResultLoading<boolean>;
  return [status, cancel];
}

describe('useAsync()', () => {
  it.each([true, false, undefined, null]) ('When init is used = %s should handle Promise.resolve', async(useInit) => {
    const props = useInit === null ? undefined : { useInit } as ConfigurationProps;

    const {result, waitForNextUpdate} = renderHook<boolean, [AsyncStatusResult<boolean>, ((...args: any) => Promise<void>) & { cancel: () => void }]>(() =>
      useAsync<boolean>(() =>
        new Promise((resolve) => {
          setTimeout(() => resolve(true), 1000);
        }),
        props
      )
    );
    const [status1] = resolveLoading(result.current[0]);
    expect(status1).toStrictEqual(useInit === true ? { status :AsyncStatus.INIT } : { status :AsyncStatus.LOADING });

    // noinspection DuplicatedCode
    act(() => { result.current[1](); })
    const [status2, cancel2] = resolveLoading(result.current[0]);
    expect(status2).toStrictEqual({ status :AsyncStatus.LOADING });
    expect(cancel2).toBeDefined();
    act(() => { jest.advanceTimersByTime(1000) });
    await waitForNextUpdate()
    expect(result.current[0]).toStrictEqual({ status :AsyncStatus.SUCCESS, value: true } as AsyncResulSuccess<boolean>);
  });

  it('should cancel the callback', async () => {
    const {result} = renderHook<boolean, [AsyncStatusResult<boolean>, ((...args: any) => Promise<void>) & { cancel: () => void }]>(() =>
      useAsync<boolean>(() =>
          new Promise((resolve) => {
            setTimeout(() => resolve(true), 1000);
          })
      )
    );

    let cancelled
    act(() => { cancelled = result.current[1]() });
    const [status, cancel] = resolveLoading(result.current[0]);
    expect(status).toStrictEqual({ status :AsyncStatus.LOADING });
    act(() => { cancel(); });
    act(() => { jest.advanceTimersByTime(1000) })
    await cancelled
    expect(result.current[0]).toStrictEqual({ status :AsyncStatus.CANCELLED } as AsyncResulCancelled<boolean>);
  })

  it('should restart after cancel', async () => {
    const {result, waitForNextUpdate} = renderHook<boolean, [AsyncStatusResult<boolean>, ((...args: any) => Promise<void>) & { cancel: () => void }]>(() =>
      useAsync<boolean>(() =>
          new Promise((resolve) => {
            setTimeout(() => resolve(true), 1000);
          })
      )
    );

    // Initial cancellation
    act(() => { result.current[1]() })
    const [status1, cancel1] = resolveLoading(result.current[0]);
    expect(status1).toStrictEqual({ status :AsyncStatus.LOADING });
    act(() => cancel1())
    act(() => { jest.advanceTimersByTime(1000) })
    expect(result.current[0]).toStrictEqual({ status :AsyncStatus.CANCELLED } as AsyncResulCancelled<boolean>);
    // Try again
    // noinspection DuplicatedCode
    act(() => { result.current[1]() })
    const [status2, cancel2] = resolveLoading(result.current[0]);
    expect(status2).toStrictEqual({ status :AsyncStatus.LOADING });
    expect(cancel2).toBeDefined();
    act(() => { jest.advanceTimersByTime(1000) })
    await waitForNextUpdate()
    expect(result.current[0].status).toBe(AsyncStatus.SUCCESS)
    expect(result.current[0]).toStrictEqual({ status :AsyncStatus.SUCCESS, value: true } as AsyncResulSuccess<boolean>);
  })
})
