// A ideia do Facade é abstrair a execução do código.
// Então ele une tudo.

const TextProcessorFluentAPI = require("./textProcessorFluentAPI");

class TextProcessorFacade {
  #textProcessorFluentAPI;
  constructor(text) {
    this.#textProcessorFluentAPI = new TextProcessorFluentAPI(text);
  }

  getPeopleFromPDF() {
    return this.#textProcessorFluentAPI
      .extractPeopleData()
      .divideTextInColumns()
      .removeEmptyCharacteres()
      .mapPerson()
      .build();
  }
}

module.exports = TextProcessorFacade;
