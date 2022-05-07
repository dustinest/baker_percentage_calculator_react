export enum AsyncStatus {
    INIT = "init",
    LOADING = "loading",
    SUCCESS = "success",
    ERROR = "error",
    CANCELLED = "cancelled"
}

type BaseAsyncStatusResult<S extends AsyncStatus> = { status: S; }

export type AsyncResultIdle = BaseAsyncStatusResult<AsyncStatus.INIT>;
export type AsyncResultLoading = {
    cancel: () => void;
} & BaseAsyncStatusResult<AsyncStatus.LOADING>;
export type AsyncResulSuccess<ValueType> = {
    value: ValueType;
} &  BaseAsyncStatusResult<AsyncStatus.SUCCESS>;

export type AsyncResulError<ErrorType> = {
    error: ErrorType;
} & BaseAsyncStatusResult<AsyncStatus.ERROR>

export type AsyncResulCancelled = BaseAsyncStatusResult<AsyncStatus.CANCELLED>;

export type AsyncStatusResult<ValueType extends any = any, ErrorType extends any = Error> =
    AsyncResultIdle |
    AsyncResultLoading |
    AsyncResulSuccess<ValueType> |
    AsyncResulError<ErrorType> |
    AsyncResulCancelled;

export type ConfigurationProps = {
    idleAsLoading?: boolean; // skips idle part and does return idle as loading
}
export type TimeoutAsyncConfigurationProps = {
    milliseconds?: number;
} & ConfigurationProps;
