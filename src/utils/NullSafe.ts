/**
 * Tests if value is not null and undefined
 * @param value to test
 * Returns true if value is set - not null and not undefined otherwise false
 */
export const hasValue = <T>(value: T | undefined | null): value is T => value !== undefined && value !== null;

/**
 * Tests if value is null or undefined
 * @param value to test
 * Returns true if value is null or undefined otherwise false
 */
export const hasNoValue = (value: any): boolean => value === null || value === undefined;

type ProviderType<T> = () => T;

/**
 * Returns value if set otherwise defaultValue
 * @param value to return if is not null or not undefined
 * @param defaultValue to return if value is not provided
 */
export const valueOf = <T>(
    value: T | undefined | null,
    defaultValue: NonNullable<T> | ProviderType<NonNullable<T>>
): T => {
    if (hasValue(value)) return value;
    if (defaultValue instanceof Function) return defaultValue();
    return defaultValue;
};

/**
 * Returns null safe array with not null items
 * @param value - array to provide
 * Returns empty array if value is null or undefined otherwise array provided with null safe values
 */
export const valuesOf = <T>(value: T[] | undefined | null): T[] => {
    return valueOf(value, []).filter(hasValue);
};

export class Optional<T> {
    private readonly value: T;

    constructor(value: T) {
        this.value = value;
    }

    filter(filter: (value: T) => boolean): Optional<T> {
        if (filter(this.value)) return this;
        return EmptyOptional;
    }

    flatMap<S>(mapper: (value: T) => Optional<S>): Optional<S> {
        return mapper(this.value);
    }

    map<S>(mapper: (value: T) => S): Optional<S> {
        const result = mapper(this.value);
        if (hasNoValue(result)) {
            return EmptyOptional;
        }
        return new Optional(result);
    }

    get(): T {
        return this.value;
    }

    ifPresent(consumer: (value: T) => void): void {
        consumer(this.value);
    }

    isPresent(): boolean {
        return true;
    }

    orElse(_other: T): T {
        return this.value;
    }

    orElseGet(_supplier: () => T): T {
        return this.value;
    }

    ifPresentOrElse(consumer: (value: T) => void, _orElseConsumer: () => void) {
        consumer(this.value);
    }

    public static of<T>(
        data: T extends null | undefined ? never : T
    ): Optional<T> {
        if (hasNoValue(data))
            throw new Error("Value should never be null nor undefined!");
        return new Optional(data as T);
    }

    public static ofNullable<T>(data: T | undefined | null): Optional<T> {
        if (hasNoValue(data)) return EmptyOptional;
        return new Optional(data as T);
    }

    public static empty<T>(): Optional<T> {
        return EmptyOptional;
    }
}

const EmptyOptional = new Optional<any>(null);

EmptyOptional.isPresent = () => false;
// eslint-disable-next-line no-empty-function,@typescript-eslint/no-empty-function
EmptyOptional.ifPresent = (_consumer: (value: any) => any) => {};
EmptyOptional.filter = (_filter: (value: any) => boolean): Optional<any> =>
    EmptyOptional;
EmptyOptional.flatMap = (
    _mapper: (value: any) => Optional<any>
): Optional<any> => EmptyOptional;
EmptyOptional.map = (_mapper: (value: any) => any): Optional<any> =>
    EmptyOptional;
EmptyOptional.get = () => {
    throw new Error("Optional value is empty!");
};
EmptyOptional.orElse = (other: any): any => other;
EmptyOptional.orElseGet = (supplier: () => any): any => supplier();
EmptyOptional.ifPresentOrElse = (
    _consumer: (value: any) => void,
    orElseConsumer: () => void
) => orElseConsumer();
