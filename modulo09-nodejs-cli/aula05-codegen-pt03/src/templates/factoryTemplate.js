import Util from "../util.js";

const repositoryNameAnchor = "$$repositoryName";
const serviceNameAnchor = "$$serviceName";

const repositoryNameDepAnchor = "$$repositoryNameDep";
const serviceNameDepAnchor = "$$serviceNameDep";

const componentNameAnchor = "$$componentName";

const template = `
import $$repositoryName from '../repository/$$repositoryNameDep.js'
import $$serviceName from '../service/$$serviceNameDep.js';

export default class $$componentNameFactory {

  static getInstance() {
    const repository = new $$repositoryName();
    const service = new $$serviceName({ repository });

    return service;
  }

}`;

export function factoryTemplate(componentName, repositoryName, serviceName) {
  const txtFile = template
    .replaceAll(componentNameAnchor, Util.upperCaseFirstLetter(componentName))
    .replaceAll(
      repositoryNameDepAnchor,
      Util.lowerCaseFirstLetter(repositoryName)
    )
    .replaceAll(serviceNameDepAnchor, Util.lowerCaseFirstLetter(serviceName))
    .replaceAll(repositoryNameAnchor, Util.upperCaseFirstLetter(repositoryName))
    .replaceAll(serviceNameAnchor, Util.upperCaseFirstLetter(serviceName));

  return {
    fileName: `${componentName}Factory`,
    template: txtFile,
  };
}
