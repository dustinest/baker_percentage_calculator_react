import {Reducer, useEffect, useMemo, useReducer, useState} from "react";
// noinspection ES6PreferShortImport
import {
    AsyncResulCancelled,
    AsyncResulError,
    AsyncResulSuccess,
    AsyncResultIdle,
    AsyncResultLoading,
    AsyncStatus
} from "../type/AsyncStatus.d";
import {useLatest} from "./useLatest";

interface AsyncReducerState<ValueType, ErrorType> {
    status: AsyncStatus;
    value?: ValueType;
    error?: ErrorType;
}

type AsyncActionStatus<T extends AsyncStatus> = {
    status: T;
}

type AsyncActionSuccess<ValueType> = {
    value: ValueType;
} & AsyncActionStatus<AsyncStatus.SUCCESS>

type AsyncActionError<ErrorType> = {
    error?: ErrorType
} & AsyncActionStatus<AsyncStatus.ERROR>

type AsyncStatusIdle = AsyncActionStatus<AsyncStatus.IDLE>
type AsyncStatusLoading = AsyncActionStatus<AsyncStatus.LOADING>
type AsyncStatusCancelled = AsyncActionStatus<AsyncStatus.CANCELLED>

type AsyncAction<ValueType, ErrorType> =
    AsyncActionSuccess<ValueType> |
    AsyncActionError<ErrorType> |
    AsyncStatusIdle |
    AsyncStatusLoading |
    AsyncStatusCancelled;

export function useAsync<
    ValueType extends any = any,
    ErrorType extends any = Error,
    Args extends any[] = any[]
    >(asyncCallback: (...args: Args) => Promise<ValueType>) {
    const [state, dispatch] = useReducer<
        Reducer<
            AsyncReducerState<ValueType, ErrorType>,
            AsyncAction<ValueType, ErrorType>
            >,
        undefined
        >((prev, action) => ({
            // This is the current status of the promise or async/await function. A
            // promise or async/await can only be in one state at a time.
            status: action.status,
            // The value is persisted between 'success' statuses. This means I can
            // still display things that depend on my current value while my new
            // value is loading.
            value: action.status === AsyncStatus.SUCCESS ? (action as AsyncActionSuccess<ValueType>).value : prev.value,
            // Errors get reset each time we leave the error state. There's really
            // no use in keeping those around. They go stale once we leave.
            error: action.status === AsyncStatus.ERROR ? (action as AsyncActionError<ErrorType>).error : void 0,
        }),
        void 0,
        () => {
            return {
                status: AsyncStatus.IDLE,
                value: void 0,
                error: void 0,
            }
        }
    );

    // Creates a stable callback that manages our loading/success/error status updates
    // as the callback is invoked.
    const storedCallback = useLatest(asyncCallback)

    const [callback] = useState(() => {
        const cancelled: Set<Promise<ValueType> | null> = new Set()
        let previous: Promise<ValueType> | null

        return Object.assign(
            async (...args: Args) => {
                // Reloading automatically cancels previous promises
                cancelled.add(previous)
                dispatch({status: AsyncStatus.LOADING} as AsyncStatusLoading)
                let current: Promise<ValueType> | null = null

                try {
                    previous = current = storedCallback.current(...args)
                    const value = await current
                    !cancelled.has(current) && dispatch({status: AsyncStatus.SUCCESS, value})
                } catch (error) {
                    current &&
                    !cancelled.has(current) &&
                    dispatch({status: AsyncStatus.ERROR, error} as AsyncActionError<ErrorType>)
                } finally {
                    cancelled.delete(current)
                }
            },
            {
                cancel: () => {
                    cancelled.add(previous)
                },
            }
        )
    })
    // Cancels any pending async callbacks when the hook unmounts
    useEffect(() => callback.cancel, [callback])

    return [
        useMemo(() => {
            switch (state.status) {
                case AsyncStatus.IDLE:
                    return {
                        waiting: true,
                        status: AsyncStatus.IDLE
                    } as AsyncResultIdle;
                case AsyncStatus.LOADING:
                    return {
                        waiting: true,
                        status: AsyncStatus.LOADING,
                        cancel: () => {
                            // Prevent the callback from dispatching
                            callback.cancel()
                            // Create a new callback and set status to cancelled
                            dispatch({status: AsyncStatus.CANCELLED})
                        },
                    } as AsyncResultLoading;
                case AsyncStatus.SUCCESS:
                    return {
                        status: AsyncStatus.SUCCESS,
                        value: state.value,
                        success: true
                    } as AsyncResulSuccess<ValueType>;
                case AsyncStatus.ERROR:
                    return {
                        status: AsyncStatus.ERROR,
                        error: state.error,
                        failed: true
                    } as AsyncResulError<ErrorType>
                case AsyncStatus.CANCELLED:
                    return {
                        status: AsyncStatus.CANCELLED,
                        failed: true
                    } as AsyncResulCancelled;
            }
        }, [callback, state]),
        callback,
    ] as const
}
