import {hasValue, hasNoValue} from "./hasValue";

describe("Test hasValue", () => {
  it.each([null, undefined])("%s Should be false", (v) => {
    expect(hasValue(v)).toBeFalsy();
  });
  it.each([[], "", false, true, 0, 1, -1, "a"])("%s Should be true", (v) => {
    expect(hasValue(v)).toBeTruthy();
  });
  it.each([null, undefined, Number.parseFloat("abcde")])("%s Should be false", (v) => {
    expect(hasValue(v)).toBeFalsy();
  });
  it.each([1, -1, 0, 123, 1.23, 0.001, -0.001, Number.parseFloat("1.1"), Number.parseInt("1.1")])("%s Should be true", (v) => {
    expect(hasValue(v)).toBeTruthy();
  });
});

describe("hasNoValue", () => {
  it.each([null, undefined])("%s Should be false", (v) => {
    expect(hasNoValue(v)).toBeTruthy();
  });
  it.each([[], "", false, true, 0, 1, -1, "a"])("%s Should be true", (v) => {
    expect(hasNoValue(v)).toBeFalsy();
  });
  it.each([null, undefined, Number.parseFloat("abcde")])("%s Should be false", (v) => {
    expect(hasNoValue(v)).toBeTruthy();
  });
  it.each([1, -1, 0, 123, 1.23, 0.001, -0.001, Number.parseFloat("1.1"), Number.parseInt("1.1")])("%s Should be true", (v) => {
    expect(hasNoValue(v)).toBeFalsy();
  });
});

