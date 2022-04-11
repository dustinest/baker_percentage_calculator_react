export type ProviderType<T> = () => T;
export type DefaultValueType<T> = NonNullable<T> | ProviderType<NonNullable<T>>;

export const resolveDefaultProvider = <T>(value: DefaultValueType<T>) => {
  if (value instanceof Function) return value();
  return value;
}
