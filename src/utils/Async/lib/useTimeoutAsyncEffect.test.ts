import {renderHook, act} from '@testing-library/react-hooks'
import {AsyncResulError, AsyncResultLoading, AsyncStatus, AsyncStatusResult} from "../type/AsyncStatus";
import { useTimeoutAsyncEffect } from './useTimeoutAsyncEffect';

beforeAll(jest.useFakeTimers);
afterAll(jest.useRealTimers);

const resolveLoading = <T>(result: AsyncStatusResult<T>): { status: AsyncStatus.LOADING; } => {
  const {cancel, ...status} = result as AsyncResultLoading<T>;
  return status;
}

const milliseconds = 100;
const resultTimeout = 500;

describe('useAsyncEffect()', () => {
  it('should update when deps change', async () => {
    const {result, rerender, waitForNextUpdate} = renderHook(
      ({deps}) =>
        useTimeoutAsyncEffect<boolean>(
          () =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve(deps[0])
              }, resultTimeout)
            }),
          deps, {milliseconds}),
      {
        initialProps: {deps: [true]},
      }
    );
    expect(resolveLoading(result.current)).toStrictEqual({ status :AsyncStatus.LOADING });
    act(() => { jest.advanceTimersByTime(resultTimeout + milliseconds) });
    await waitForNextUpdate();
    expect(result.current).toStrictEqual({ status: AsyncStatus.SUCCESS, value: true });
    rerender({deps: [false]});
    // We still need the timeout to kick in
    expect(result.current).toStrictEqual({ status: AsyncStatus.SUCCESS, value: true });
    act(() => { jest.advanceTimersByTime(milliseconds); });
    // Yes, this value should be persisted and not reset
    expect(resolveLoading(result.current)).toStrictEqual({ status :AsyncStatus.LOADING, value: true });
    act(() => { jest.advanceTimersByTime(resultTimeout); });
    await waitForNextUpdate();
    expect(resolveLoading(result.current)).toStrictEqual({ status :AsyncStatus.SUCCESS, value: false });
  })

  it('should handle thrown exceptions', async () => {
    const {result, waitForNextUpdate} = renderHook(() =>
      useTimeoutAsyncEffect(async () => {
        throw new Error('Something got wrong!');
      }, [])
    );
    expect(resolveLoading(result.current)).toStrictEqual({ status :AsyncStatus.LOADING });
    act(() => { jest.advanceTimersByTime(milliseconds); });
    await waitForNextUpdate()
    const {error, ...others} = resolveLoading(result.current) as any as AsyncResulError<boolean>;
    expect(others).toStrictEqual({ status :AsyncStatus.ERROR });
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Something got wrong!')
  })

  it('should handle Promise.reject', async () => {
    const {result, waitForNextUpdate} = renderHook(() =>
      useTimeoutAsyncEffect(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject('Something got wrong!'), resultTimeout)
          }),
        [], {milliseconds}
      )
    )

    expect(resolveLoading(result.current)).toStrictEqual({ status :AsyncStatus.LOADING });
    act(() => { jest.advanceTimersByTime(milliseconds + resultTimeout) });
    await waitForNextUpdate()
    const {error, ...others} = resolveLoading(result.current) as any as AsyncResulError<boolean>;
    expect(others).toStrictEqual({ status: AsyncStatus.ERROR });
    expect(error).toBe('Something got wrong!')
  })
})
