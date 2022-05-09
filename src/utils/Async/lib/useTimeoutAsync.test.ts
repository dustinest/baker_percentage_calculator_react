import {renderHook, act} from '@testing-library/react-hooks'
import {useTimeoutAsync} from "./useTimeoutAsync";
import { AsyncStatus } from "../type/AsyncStatus";
import {UseTimeoutAsyncProps} from "../type/UseAsyncProps";
import {AsyncResulCancelled, AsyncResulSuccess, AsyncResultWorking, AsyncStatusResult} from '../type/UseAsyncResult';

beforeAll(jest.useFakeTimers);
afterAll(jest.useRealTimers);

const resolveLoading = (result: AsyncStatusResult<boolean>): [{ status: AsyncStatus.WORKING; }, () => void] => {
  const {cancel, ...status} = result as AsyncResultWorking<boolean>;
  return [status, cancel];
}
const milliseconds = 100;
const resultTimeout = 500;

describe('useAsync()', () => {
  it.each([true, false, undefined, null]) ('When init is used = %s should handle Promise.resolve', async(useInit) => {
    const props = useInit === null ? { milliseconds } : { useInit, milliseconds  } as UseTimeoutAsyncProps;

    const {result, waitForNextUpdate} = renderHook<boolean, [AsyncStatusResult<boolean>, ((...args: any) => Promise<void>) & { cancel: () => void }]>(() =>
      useTimeoutAsync<boolean>(() =>
          new Promise((resolve) => {
            setTimeout(() => resolve(true), resultTimeout);
          }),
        props)
    );
    const [status1] = resolveLoading(result.current[0]);
    expect(status1).toStrictEqual(useInit === true ? { status :AsyncStatus.INIT } : { status :AsyncStatus.WORKING });

    // noinspection DuplicatedCode
    act(() => { result.current[1](); })
    // When we first call the status still is init as timeout is 5 milliseconds
    const [status2] = resolveLoading(result.current[0]);
    expect(status2).toStrictEqual(useInit === true ? { status :AsyncStatus.INIT } : { status :AsyncStatus.WORKING });

    act(() => { jest.advanceTimersByTime(milliseconds) });
    const [status3, cancel3] = resolveLoading(result.current[0]);
    expect(status3).toStrictEqual({ status :AsyncStatus.WORKING });
    expect(cancel3).toBeDefined();

    act(() => { jest.advanceTimersByTime(resultTimeout) });
    await waitForNextUpdate()
    expect(result.current[0]).toStrictEqual({ status :AsyncStatus.SUCCESS, value: true } as AsyncResulSuccess<boolean>);
  });

  it('should cancel the callback', async () => {

    const {result} = renderHook<boolean, [AsyncStatusResult<boolean>, ((...args: any) => Promise<void>) & { cancel: () => void }]>(() =>
      useTimeoutAsync<boolean>(() =>
          new Promise((resolve) => {
            setTimeout(() => resolve(true), resultTimeout);
          }),
        {milliseconds})
    );

    let cancelled
    act(() => { cancelled = result.current[1]() });
    const [status, cancel] = resolveLoading(result.current[0]);
    expect(status).toStrictEqual({ status :AsyncStatus.WORKING });
    act(() => { cancel(); });
    act(() => { jest.advanceTimersByTime(resultTimeout) })
    await cancelled
    expect(result.current[0]).toStrictEqual({ status :AsyncStatus.CANCELLED } as AsyncResulCancelled<boolean>);
  })

  it('should restart after cancel', async () => {
    const {result, waitForNextUpdate} = renderHook<boolean, [AsyncStatusResult<boolean>, ((...args: any) => Promise<void>) & { cancel: () => void }]>(() =>
      useTimeoutAsync<boolean>(() =>
          new Promise((resolve) => {
            setTimeout(() => resolve(true), resultTimeout);
          }),
        {milliseconds})
    );

    // Initial cancellation
    act(() => { result.current[1]() })
    const [status1, cancel1] = resolveLoading(result.current[0]);
    expect(status1).toStrictEqual({ status :AsyncStatus.WORKING });
    act(() => cancel1())
    act(() => { jest.advanceTimersByTime(resultTimeout) })
    expect(result.current[0]).toStrictEqual({ status :AsyncStatus.CANCELLED } as AsyncResulCancelled<boolean>);
    // Try again
    // noinspection DuplicatedCode
    act(() => { result.current[1]() })
    // Wait to loading to trigger in
    act(() => { jest.advanceTimersByTime(milliseconds) });
    const [status2, cancel2] = resolveLoading(result.current[0]);
    expect(status2).toStrictEqual({ status :AsyncStatus.WORKING });
    expect(cancel2).toBeDefined();
    act(() => { jest.advanceTimersByTime(resultTimeout) })
    await waitForNextUpdate()
    expect(result.current[0].status).toBe(AsyncStatus.SUCCESS)
    expect(result.current[0]).toStrictEqual({ status :AsyncStatus.SUCCESS, value: true } as AsyncResulSuccess<boolean>);
  })
})
