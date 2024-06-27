class Fibonacci {
  /**
   * Generators
   */

  // Com generators, enquanto houver yield, tem retorno.
  // Caso a gente chamar um return, a gente "mata" o generator.
  *execute(input, current = 0, next = 1) {
    // processou todas as sequencias
    // e para
    if (input === 0) {
      return;
    }

    // Retorna valor.
    yield current;

    // Delega a função,  mas não retorna valor.
    yield* this.execute(input - 1, next, current + next);
  }
}

module.exports = Fibonacci;
