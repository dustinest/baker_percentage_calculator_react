export enum AsyncStatus {
    INIT = "init",
    LOADING = "loading",
    SUCCESS = "success",
    ERROR = "error",
    CANCELLED = "cancelled"
}

type BaseAsyncStatusResult<S extends AsyncStatus> = { status: S; }
type BaseMaybeValueResult<ValueType, S extends AsyncStatus> = {
    value?: ValueType;
} & BaseAsyncStatusResult<S>;

export type AsyncResultIdle<ValueType extends any = any> = BaseMaybeValueResult<ValueType, AsyncStatus.INIT>;

export type AsyncResultLoading<ValueType extends any = any> = {
    cancel: () => void;
} & BaseMaybeValueResult<ValueType, AsyncStatus.LOADING>;

export type AsyncResulSuccess<ValueType extends any = any> = {
    value: ValueType;
} &  BaseAsyncStatusResult<AsyncStatus.SUCCESS>;

export type AsyncResulError<ValueType extends any = any, ErrorType extends any = Error> = {
    error: ErrorType;
} & BaseMaybeValueResult<ValueType, AsyncStatus.ERROR>

export type AsyncResulCancelled<ValueType extends any = any> = BaseMaybeValueResult<ValueType, AsyncStatus.CANCELLED>;

export type AsyncStatusResult<ValueType extends any = any, ErrorType extends any = Error> =
    AsyncResultIdle<ValueType> |
    AsyncResultLoading<ValueType> |
    AsyncResulSuccess<ValueType> |
    AsyncResulError<ValueType, ErrorType> |
    AsyncResulCancelled<ValueType>;

export type ConfigurationProps = {
    useInit?: boolean; // if init should be used. Otherwise is Loading
}
export type TimeoutAsyncConfigurationProps = {
    milliseconds?: number;
} & ConfigurationProps;
