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
import { createFiles } from "../../src/createFiles.js";
import Util from "../../src/util.js";

function getAllFunctionsFromInstance(instance) {
  return Reflect.ownKeys(Reflect.getPrototypeOf(instance)).filter(
    (method) => method !== "constructor"
  );
}

function generateFilePath({
  mainPath,
  defaultMainFolder,
  layers,
  componentName,
}) {
  return layers.map((layer) => {
    // factory
    // ~....../src/factory/heroesFactory
    const fileName = `${componentName}${Util.upperCaseFirstLetter(layer)}.js`;

    return join(mainPath, defaultMainFolder, layer, fileName);
  });
}

describe("#Integration - Files - Files Structure", () => {
  const config = {
    defaultMainFolder: "src",
    mainPath: "",
    // Colocamos um sort, pq o sistema retorna em ordem alfabetica
    layers: ["service", "factory", "repository"].sort(),
    componentName: "heroes",
  };

  // Como não obtivemos o caminho relativo, estamos pensando que o comando
  // vai rodar no package.json que está na raiz, por isso, iniciamos pegando
  // da pasta test.
  const packageJSON = "package.json";
  const packageJSONLocation = join("./test/integration/mocks", packageJSON);

  beforeAll(async () => {
    config.mainPath = await fsPromises.mkdtemp(join(tmpdir(), "layers-"));
    await fsPromises.copyFile(
      packageJSONLocation,
      join(config.mainPath, packageJSON)
    );
    await createLayersIfNotExists(config);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await fsPromises.rm(config.mainPath, { recursive: true });
  });

  /**
   * Aqui vamos validar que:
   * - O arquivo gerado está em disco.
   * - O arquivo gerado é um arquivo javascript válido.
   */
  test("Repository class should have create, read, update and delete methods", async () => {
    const myConfig = {
      ...config,
      layers: ["repository"],
    };

    await createFiles(myConfig);

    const [repositoryFile] = generateFilePath(myConfig);

    // dynamic import => para funcionar, dentro do pacote, deve existir um package.json com import.
    // Com isso aqui, faço exploit :-)
    const { default: Repository } = await import(repositoryFile);
    const instance = new Repository();
    const expectedNotImplemented = (fn) =>
      expect(() => fn.call()).rejects.toEqual("method not implemented");

    expectedNotImplemented(instance.create);
    expectedNotImplemented(instance.read);
    expectedNotImplemented(instance.update);
    expectedNotImplemented(instance.delete);
  });

  test("Service should have the same signature of repository and call its methods", async () => {
    const myConfig = {
      ...config,
      layers: ["repository", "service"],
    };

    await createFiles(myConfig);

    const [repositoryFile, serviceFile] = generateFilePath(myConfig);

    const { default: Repository } = await import(repositoryFile);
    const { default: Service } = await import(serviceFile);
    const repository = new Repository();
    const service = new Service({ repository });

    const allRepositoryMethods = getAllFunctionsFromInstance(repository);

    // spyOn dinamicamente, pois estamos gerando código dinamicamente.
    allRepositoryMethods.forEach((method) =>
      jest.spyOn(repository, method).mockResolvedValue()
    );

    // Executa todos os métodos de service.
    getAllFunctionsFromInstance(service).forEach((method) =>
      service[method].call(service, [])
    );

    // Agora iremos verificar se todos os métodos de repository foram chamados.
    allRepositoryMethods.forEach((method) =>
      expect(repository[method]).toHaveBeenCalled()
    );
  });

  test("Factory instance should match layers", async () => {
    const myConfig = {
      ...config,
    };

    await createFiles(myConfig);
    // Colocamos em ordem alfabética, pois já rodamos um sort no layers.
    const [factoryFile, repositoryFile, serviceFile] =
      generateFilePath(myConfig);

    const { default: Repository } = await import(repositoryFile);
    const { default: Service } = await import(serviceFile);
    const { default: Factory } = await import(factoryFile);

    const expectedInstance = new Service({ repository: new Repository() });
    // A factory retorna uma instancia de service.
    const instance = Factory.getInstance();

    // E essa instancia de service deve ser igual a esperada.
    expect(instance).toMatchObject(expectedInstance);

    // E essa instancia de service deve ser uma instancia de service.
    expect(instance).toBeInstanceOf(Service);
  });
});
