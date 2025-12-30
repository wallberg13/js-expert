import fs from "fs";
import fsPromises from "fs/promises";
import templates from "./templates/index.js";
import Util from "./util.js";

const defaultDependencies = (layer, componentName) => {
  const dependencies = {
    repository: [],
    service: [`${componentName}Repository`],
    factory: [`${componentName}Repository`, `${componentName}Service`],
  };

  return dependencies[layer].map(
    // Pode ser que venha: Product
    // Quero que retorne: product
    Util.lowerCaseFirstLetter
  );
};

function executeWrites(pendingFilesToWrite) {
  return Promise.all(
    pendingFilesToWrite.map(({ targetFile, txtFile }) =>
      fsPromises.writeFile(targetFile, txtFile)
    )
  );
}

export async function createFiles({
  mainPath,
  defaultMainFolder,
  layers,
  componentName,
}) {
  const keys = Object.keys(templates);

  const pendingFilesToWrite = [];

  for (const layer of layers) {
    /**
     * keys = [
     *  "repositoryTemplate",
     *  "serviceTemplate",
     *  "factoryTemplate",
     * ]
     *
     * layers = [
     *  "inexistent"
     * ]
     */
    const chosenTemplate = keys.find((key) => key.includes(layer));
    if (!chosenTemplate) {
      return { error: "the chosen template doesnt have a template" };
    }

    const template = templates[chosenTemplate];

    const targetFolder = `${mainPath}/${defaultMainFolder}/${layer}`;
    const dependencies = defaultDependencies(layer, componentName);

    const { fileName, template: txtFile } = template(
      componentName,
      ...dependencies
    );
    const targetFile = `${targetFolder}/${Util.lowerCaseFirstLetter(
      fileName
    )}.js`;

    pendingFilesToWrite.push({ targetFile, txtFile });
  }

  await executeWrites(pendingFilesToWrite);

  return { success: true };
}
