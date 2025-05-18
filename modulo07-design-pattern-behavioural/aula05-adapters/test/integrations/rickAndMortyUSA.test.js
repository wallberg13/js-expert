import { expect, describe, jest, beforeEach, test } from "@jest/globals";
import fs from "fs/promises";
import Character from "../../src/entities/character";
import RickAndMortyUSA from "../../src/business/integrations/rickAndMortyUSA.js";
import axios from "axios";

describe("#RickAndMortyUSA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("#getCharactersFromXML should return a list of Character Entity", async () => {
    const response = await fs.readFile("./test/mocks/characters.xml");
    const expected = [
      {
        gender: "Male",
        id: 10,
        location: "Worldender's lair",
        name: "Alan Rails",
        origin: "unknown",
        species: "Human",
        status: "Dead",
        type: "Superhuman (Ghost trains summoner)",
      },
    ];

    // Mock axios.get
    jest.spyOn(axios, "get").mockResolvedValue({ data: response });

    const result = await RickAndMortyUSA.getCharactersFromXML();
    expect(result).toMatchObject(expected);
  });

  test("#getCharactersFromXML should return an empty list if the API returns nothing", async () => {
    const response = await fs.readFile("./test/mocks/characters-empty.xml");
    const expected = [];

    // Mock axios.get
    jest.spyOn(axios, "get").mockResolvedValue({ data: response });

    const result = await RickAndMortyUSA.getCharactersFromXML();
    expect(result).toEqual(expected);
  });
});
