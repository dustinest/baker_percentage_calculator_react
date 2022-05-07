import {renderHook, act} from '@testing-library/react-hooks'
import {AsyncResulError, AsyncResultLoading, AsyncStatus, AsyncStatusResult} from "../type/AsyncStatus";
import { useAsyncEffect } from './useAsyncEffect';

beforeAll(jest.useFakeTimers);
afterAll(jest.useRealTimers);

const resolveLoading = <T>(result: AsyncStatusResult<T>): { status: AsyncStatus.LOADING; } => {
  const {cancel, ...status} = result as AsyncResultLoading<T>;
  return status;
}

describe('useAsyncEffect()', () => {
  it('should update when deps change', async () => {
    const {result, rerender, waitForNextUpdate} = renderHook(
      ({deps}) =>
        useAsyncEffect<boolean>(
          () =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve(deps[0])
              }, 1000)
            }),
          deps
        ),
      {
        initialProps: {deps: [true]},
      }
    );
    expect(resolveLoading(result.current)).toStrictEqual({ status :AsyncStatus.LOADING });
    act(() => { jest.advanceTimersByTime(1000) });
    await waitForNextUpdate();
    expect(result.current).toStrictEqual({ status: AsyncStatus.SUCCESS, value: true });
    rerender({deps: [false]});
    // Yes, this value should be persisted and not reset
    expect(resolveLoading(result.current)).toStrictEqual({ status :AsyncStatus.LOADING, value: true });
    act(() => { jest.advanceTimersByTime(1000); });
    await waitForNextUpdate();
    expect(resolveLoading(result.current)).toStrictEqual({ status :AsyncStatus.SUCCESS, value: false });
  })

  it('should handle thrown exceptions', async () => {
    const {result, waitForNextUpdate} = renderHook(() =>
      useAsyncEffect(async () => {
        throw new Error('Something got wrong!');
      }, [])
    );
    expect(resolveLoading(result.current)).toStrictEqual({ status :AsyncStatus.LOADING });
    await waitForNextUpdate()
    const {error, ...others} = resolveLoading(result.current) as any as AsyncResulError<boolean>;
    expect(others).toStrictEqual({ status :AsyncStatus.ERROR });
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Something got wrong!')
  })

  it('should handle Promise.reject', async () => {
    const {result, waitForNextUpdate} = renderHook(() =>
      useAsyncEffect(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject('Something got wrong!'), 1000)
          }),
        []
      )
    )

    expect(resolveLoading(result.current)).toStrictEqual({ status :AsyncStatus.LOADING });
    act(() => { jest.advanceTimersByTime(1000) });
    await waitForNextUpdate()
    const {error, ...others} = resolveLoading(result.current) as any as AsyncResulError<boolean>;
    expect(others).toStrictEqual({ status: AsyncStatus.ERROR });
    expect(error).toBe('Something got wrong!')
  })
})
