export default class Util {
  // wallberg => [0] => "w"
  // first = e, rest = allberg
  static #transform({ str: [first, ...rest], upperCase = true }) {
    if (!first) return "";

    const firstLetter = upperCase ? first.toUpperCase() : first.toLowerCase();

    return [firstLetter, ...rest].join("");
  }

  static upperCaseFirstLetter(str) {
    return Util.#transform({ str }, true);
  }

  static lowerCaseFirstLetter(str) {
    return Util.#transform({ str, upperCase: false });
  }
}
