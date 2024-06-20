const { readFile } = require("fs/promises");
const { error } = require("./constants");

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ["id", "name", "profession", "age"],
};

class File {
  static async csvToJson(filePath) {
    const content = await readFile(filePath, "utf-8");

    const validation = this.isValid(content);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const result = this.parserCSVToJSON(content);
    return result;
  }

  static isValid(csvString, options = DEFAULT_OPTIONS) {
    // [0] = headers
    // [1] = linha 1
    // [2] = linha 2
    // ..variavel = restante do arquivo
    const [header, ...fileWithoutHeader] = csvString.split(/\r?\n/);
    const isHeaderValid = header === options.fields.join(",");

    /**
     * Header invalido
     */
    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false,
      };
    }

    /**
     * Arquivo sem header
     */
    if (
      !fileWithoutHeader.length ||
      fileWithoutHeader.length > options.maxLines
    ) {
      return {
        error: error.FILE_LENGHT_ERROR_MESSAGE,
        valid: false,
      };
    }

    return { valid: true };
  }

  /**
   *
   * @param {string} csvString
   */
  static parserCSVToJSON(csvString) {
    const lines = csvString.split(/\r?\n/);

    // Vamos remover a primeira linha: headers
    const firstFile = lines.shift();
    const header = firstFile.split(",");

    const users = lines.map((line) => {
      const columns = line.split(",");

      const user = {};
      for (const index in columns) {
        // index (in => retorna cada indice do array)
        user[header[index]] = columns[index].trim();
      }

      return user;
    });

    return users;
  }
}

module.exports = File;
