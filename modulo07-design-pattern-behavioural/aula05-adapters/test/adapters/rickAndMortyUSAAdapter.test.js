import { expect, describe, jest, beforeEach, test } from "@jest/globals";
import RickAndMortyUSA from "../../src/business/integrations/rickAndMortyUSA";
import RickAndMortyUSAAdapter from "../../src/business/adapter/rickAndMortyUSAAdapter";

describe("#RickAndMortyUSAAdapter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("#getCharacters should be an adapter for RickAndMortyUSA.getCharactersFromJSON", async () => {
    const USAIntegration = jest
      .spyOn(RickAndMortyUSA, RickAndMortyUSA.getCharactersFromXML.name)
      .mockResolvedValue([]);

    const result = await RickAndMortyUSAAdapter.getCharacters();

    expect(result).toEqual([]);
    expect(USAIntegration).toHaveBeenCalled();
  });
});
