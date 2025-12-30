import {
  expect,
  describe,
  test,
  jest,
  beforeAll,
  beforeEach,
  afterAll,
} from "@jest/globals";

import { tmpdir } from "os"; // Criar pasta temporária
import fsPromises from "fs/promises";
import { join } from "path";
import { createLayersIfNotExists } from "../../src/createLayers.js";

function getFolders({ mainPath, defaultMainFolder }) {
  return fsPromises.readdir(join(mainPath, defaultMainFolder));
}

describe("#Integration - Layers - Folders Structure", () => {
  const config = {
    defaultMainFolder: "src",
    mainPath: "",
    // Colocamos um sort, pq o sistema retorna em ordem alfabetica
    layers: ["service", "factory", "repository"].sort(),
  };

  beforeAll(async () => {
    config.mainPath = await fsPromises.mkdtemp(join(tmpdir(), "skeleton-"));
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await fsPromises.rm(config.mainPath, { recursive: true });
  });

  test("should not create folders if it exists", async () => {
    const beforeRun = await fsPromises.readdir(config.mainPath);

    await createLayersIfNotExists(config);

    const afterRun = await getFolders(config);
    expect(beforeRun).not.toStrictEqual(afterRun);
    expect(afterRun).toEqual(config.layers);
  });

  test("should create folders if doesnt doesnt exist", async () => {
    const beforeRun = await getFolders(config);

    /**
     * Eu deveria não contar que o teste anterior estivesse rodando.
     */
    await createLayersIfNotExists(config);

    const afterRun = await getFolders(config);
    expect(afterRun).toEqual(beforeRun);
  });
});
