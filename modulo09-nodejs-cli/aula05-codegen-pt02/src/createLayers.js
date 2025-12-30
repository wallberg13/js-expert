import fs from "fs";
import fsPromises from "fs/promises";

export async function createLayersIfNotExists({
  mainPath,
  defaultMainFolder,
  layers,
}) {
  const defaultPath = `${mainPath}/${defaultMainFolder}`;

  const foldersToCreate = layers.filter(
    (layer) => !fs.existsSync(`${defaultPath}/${layer}`)
  );
  const results = foldersToCreate.map(
    (folder) => fsPromises.mkdir(`${defaultPath}/${folder}`),
    { recursive: true }
  );

  return await Promise.all(results);
}
