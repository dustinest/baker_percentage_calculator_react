import {Optional} from "./Optional";

describe("Check empty optional", () => {
  it.each([
    Optional.empty<string | undefined | null>(),
    Optional.ofNullable<string | undefined | null>(null),
    Optional.ofNullable<string | undefined | null>(undefined)
  ])("Optional is empty", (v) => {
    expect(v.isPresent()).toBeFalsy();
    const callable = jest.fn();
    v.ifPresent(callable);
    expect(v.map(callable).isPresent()).toBeFalsy();
    expect(v.flatMap(callable).isPresent()).toBeFalsy();
    expect(v.filter(callable).isPresent()).toBeFalsy();
    expect(v.orElse("abc")).toBe("abc");
    expect(v.orElse(null)).toBe(null);
    expect(v.orElse(undefined)).toBe(undefined);
    expect(v.orElseGet(() => "lorem ipsum est")).toBe("lorem ipsum est");
    expect(v.orElseGet(() => null)).toBe(null);
    expect(v.orElseGet(() => undefined)).toBe(undefined);
    expect(v.get).toThrow("Optional value is empty!");

    const orElseConsumer = jest.fn();
    v.ifPresentOrElse(callable, orElseConsumer);
    expect(callable).toBeCalledTimes(0);
    expect(orElseConsumer).toBeCalledTimes(1);
  });
});

describe("Check optional values", () => {
  const testOptional = (optional: Optional<any>, value: any) => {
    expect(optional.isPresent()).toBeTruthy();
    const callable = jest.fn();
    optional.ifPresent(callable);
    optional.map(callable);
    optional.flatMap(callable);
    optional.filter(callable);
    expect(optional.orElse("abc")).toStrictEqual(value);
    expect(optional.orElse(null)).toStrictEqual(value);
    expect(optional.orElse(undefined)).toStrictEqual(value);
    expect(optional.orElseGet(callable)).toStrictEqual(value);
    expect(optional.orElseGet(() => null)).toStrictEqual(value);
    expect(optional.orElseGet(() => undefined)).toStrictEqual(value);
    expect(optional.get()).toStrictEqual(value);
    expect(optional.map((_value: any) => null).isPresent()).toBeFalsy();
    expect(optional.map((_value: any) => undefined).isPresent()).toBeFalsy();
    expect(optional.map((_value: any) => "lorem ipsum est").get()).toBe(
      "lorem ipsum est"
    );

    const orElseConsumer = jest.fn();
    optional.ifPresentOrElse(callable, orElseConsumer);
    expect(callable).toBeCalledTimes(5);
    expect(orElseConsumer).toBeCalledTimes(0);
  };

  it.each([
    true,
    false,
    "",
    "lorem ipsum est",
    [],
    ["a, b, c"],
    { one: "a", two: "true", three: false }
  ])("Optional.of(%s)", (v) => {
    testOptional(Optional.of<any>(v), v);
  });

  it.each([
    true,
    false,
    "",
    "lorem ipsum est",
    [],
    ["a, b, c"],
    { one: "a", two: "true", three: false }
  ])("Optional.ofNullable(%s)", (v) => {
    testOptional(Optional.ofNullable<any>(v), v);
  });
});
