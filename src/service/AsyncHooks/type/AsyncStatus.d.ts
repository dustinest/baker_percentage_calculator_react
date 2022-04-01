export enum AsyncStatus {
    IDLE= "idle",
    LOADING = "loading",
    SUCCESS = "success",
    ERROR = "error",
    CANCELLED = "cancelled"
}

interface AsyncStatusResultStatus<S extends AsyncStatus> { status: S; }

export interface AsyncResultIdle extends AsyncStatusResultStatus<AsyncStatus.IDLE> {
    success: false;
    waiting: true;
    failed: false;
}
export interface AsyncResultLoading extends AsyncStatusResultStatus<AsyncStatus.LOADING> {
    cancel: () => void;
    success: false;
    waiting: true;
    failed: false;
}
export interface AsyncResulSuccess<ValueType> extends AsyncStatusResultStatus<AsyncStatus.SUCCESS> {
    value: ValueType;
    success: true;
    waiting: false;
    failed: false;
}
export interface AsyncResulError<ErrorType> extends AsyncStatusResultStatus<AsyncStatus.ERROR> {
    error: ErrorType;
    success: false;
    waiting: false;
    failed: true;
}

export interface AsyncResulCancelled extends AsyncStatusResultStatus<AsyncStatus.CANCELLED> {
    success: false;
    waiting: false;
    failed: true;
}

export type AsyncStatusResult<ValueType extends any = any, ErrorType extends any = Error> =
    AsyncResultIdle |
    AsyncResultLoading |
    AsyncResulSuccess<ValueType> |
    AsyncResulError<ErrorType> |
    AsyncResulCancelled;

