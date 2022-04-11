import {hasNoValue} from "./hasValue";

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
