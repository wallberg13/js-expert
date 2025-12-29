import { expect, describe, test, jest, beforeEach } from "@jest/globals";
import Util from "../../src/util.js";

describe("#Util - Strings", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("#upperCaseFirstLetter should transform the first letter in upperCase", () => {
    const str = "hello";
    const expected = "Hello";

    const result = Util.upperCaseFirstLetter(str);
    expect(result).toStrictEqual(expected);
  });

  test("#lowerCaseFirstLetter should transform the first letter in lowerCase", () => {
    const str = "Hello";
    const expected = "hello";

    const result = Util.lowerCaseFirstLetter(str);
    expect(result).toStrictEqual(expected);
  });

  test("#lowerCaseFirstLetter given an empty string it should return an empty", () => {
    const str = "";
    const expected = "";

    const result = Util.lowerCaseFirstLetter(str);
    expect(result).toStrictEqual(expected);
  });

  test("#upperCaseFirstLetter given an empty string it should return an empty", () => {
    const str = "";
    const expected = "";

    const result = Util.upperCaseFirstLetter(str);
    expect(result).toStrictEqual(expected);
  });
});
