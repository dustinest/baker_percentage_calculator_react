import {DependencyList, useEffect, useState} from "react";
import {useAsync} from "../index";

export const useTimeoutAsync = <
    ValueType extends any = any,
    ErrorType extends any = Error
    >(
        asyncCallback: () => Promise<ValueType>,
        dependencies: DependencyList,
        milliseconds: number = 200
) => {
    const [timeoutValue, setTimeoutValue] = useState<NodeJS.Timeout | null>(null);
    const doClearTimeout = () => {
        if (timeoutValue === null) return;
        try {
            clearTimeout(timeoutValue);
        } catch {
            // ignore;
        }
        setTimeoutValue(null);
    }
    const [state, callback] = useAsync<ValueType, ErrorType>(async () => {
        doClearTimeout();
        return new Promise<ValueType>((resolve, reject) => {
            const timeout = setTimeout(() => asyncCallback()
                    .then(resolve)
                    .catch(reject)
                    .finally(doClearTimeout)
                , milliseconds)
            setTimeoutValue(timeout);
        });
    });
    // Runs the callback each time deps change
    useEffect(() => {
        callback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies)

    return state
};

export const useValueTimeoutAsync = <ValueType extends any = any>(asyncCallback: (changedValue: ValueType) => Promise<void>, value: ValueType, milliseconds?: number,) => {
    const [cachedValue, setCachedValue] = useState<ValueType>(value);
    return useTimeoutAsync(async () => {
        if (value !== cachedValue) {
            setCachedValue(value);
            asyncCallback(value).catch(console.error);
        }
    }, [value, cachedValue], milliseconds || 200);
};
