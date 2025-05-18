import { expect, describe, jest, beforeEach, test } from "@jest/globals";
import fs from "fs/promises";
import Character from "../../src/entities/character.js";
import RickAndMortyBRL from "../../src/business/integrations/rickAndMortyBRL.js";
import axios from "axios";

describe("#RickAndMortyBRL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("#getCharactersFromJSON should return a list of Character Entity", async () => {
    const response = JSON.parse(
      await fs.readFile("./test/mocks/characters.json")
    );
    const expected = response.results.map((char) => new Character(char));

    // Mock axios.get
    jest.spyOn(axios, "get").mockResolvedValue({ data: response });

    const result = await RickAndMortyBRL.getCharactersFromJSON();
    expect(result).toStrictEqual(expected);
  });

  test("#getCharactersFromJSON should return an empty list if the API returns nothing", async () => {
    const response = JSON.parse(
      await fs.readFile("./test/mocks/characters-empty.json")
    );
    const expected = response.results;

    // Mock axios.get
    jest.spyOn(axios, "get").mockResolvedValue({ data: response });

    const result = await RickAndMortyBRL.getCharactersFromJSON();
    expect(result).toStrictEqual(expected);
  });
});
