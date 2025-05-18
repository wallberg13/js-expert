import axios from "axios";
import Character from "../../entities/character.js";

const URL =
  "https://gist.githubusercontent.com/ErickWendel/927970b8fa7117182413be100417607d/raw/d78adae11f5bdbff086827bf45f1bc649c339766/rick-and-morty-characters.json?_gl=1*1lw1i5w*_ga*MTI2MTQ4MTczNS4xNzM0MjczMTc4*_ga_37GXT4VGQK*czE3NDc1NzM3NzgkbzEyJGcxJHQxNzQ3NTc0MTg4JGowJGwwJGgw";

export default class RickAndMortyBRL {
  static async getCharactersFromJSON() {
    const {
      data: { results = [] },
    } = await axios.get(URL);
    return results.map((char) => new Character(char));
  }
}
