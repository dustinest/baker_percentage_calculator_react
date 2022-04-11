import {valueOf, valuesOf} from "./valueOf";

describe("Test valueOf", () => {
  // @ts-ignore
  it.each([null, undefined])(
    "Should not return %s but default value",
    (v: boolean | null | undefined) => {
      expect(valueOf(v, false)).toBeFalsy();
      expect(valueOf(v, true)).toBeTruthy();
    }
  );
  it.each([[], "", false, true, 0, 1, -1, "a"])(
    "Should return %s not default value",
    (v) => {
      expect(valueOf(v, false)).toBe(v);
      expect(valueOf(v, true)).toBe(v);
    }
  );

  // @ts-ignore
  it.each([null, undefined])(
    "Should not return %s but value from consumer",
    (v: boolean | null | undefined) => {
      expect(valueOf(v, () => false)).toBeFalsy();
      expect(valueOf(v, () => true)).toBeTruthy();
    }
  );
  it.each([[], "", false, true, 0, 1, -1, "a"])(
    "Should return %s not consumer",
    (v) => {
      expect(valueOf(v, () => false)).toBe(v);
      expect(valueOf(v, () => true)).toBe(v);
    }
  );
  // noinspection SpellCheckingInspection
  it.each([parseInt("abaasdas"), parseFloat("ASDADASDA")])(
    "Should return %s not consumer",
    (v) => {
      expect(valueOf(v, () => 234)).toBe(234);
      expect(valueOf(v, 234)).toBe(234);
    }
  );
  it.each([parseInt("1.23"), parseFloat("1.23")])(
    "Should return %s not consumer",
    (v) => {
      expect(valueOf(v, () => 234)).toBe(1.23);
      expect(valueOf(v, 234)).toBe(1.23);
    }
  );
});

describe("Test valuesOf", () => {
  it.each([null, undefined, []])("%s Should return empty array", (v) => {
    expect(valuesOf(v)).toStrictEqual([]);
    expect(valuesOf(v)).toStrictEqual([]);
  });
  it("Should return clean array", () => {
    expect(valuesOf([0, false, true, null, 1, 2, undefined, 3])).toStrictEqual([
      0,
      false,
      true,
      1,
      2,
      3
    ]);
  });
});
