const { error } = require("./src/constants");
const File = require("./src/file");
const assert = require("assert");

// IFEE => Função que auto se executa

/**
 * Podemos utilizar uma váriavel com mesmo nome,
 * criando blocos de execução para elas.
 */
(async () => {
  // variáveis criadas nesse bloco, só são validas durante sua execução
  {
    const filePath = "./mocks/emptyFile-invalid.csv";
    const expected = new Error(error.FILE_LENGHT_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);
    await assert.rejects(result, expected);
  }

  {
    const filePath = "./mocks/invalid-header.csv";
    const expected = new Error(error.FILE_FIELDS_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);
    await assert.rejects(result, expected);
  }

  {
    const filePath = "./mocks/fiveItems-invalid.csv";
    const expected = new Error(error.FILE_LENGHT_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);
    await assert.rejects(result, expected);
  }

  {
    const filePath = "./mocks/treeItems-valid.csv";
    const expected = [
      { id: 1, name: "xuxa da silva", profession: "developer", age: 120 },
      { id: 2, name: "xuxa da silva", profession: "developer", age: 120 },
      { id: 3, name: "xuxa da silva", profession: "developer", age: 120 },
    ];
    const result = await File.csvToJson(filePath);

    assert.deepEqual(result, expected);
  }
})();
