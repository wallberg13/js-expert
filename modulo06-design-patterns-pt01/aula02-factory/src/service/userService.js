class UserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async find(query) {
    // Implementa regra de negocio.
    const users = await this.userRepository.find(query);

    return users.map((i) => ({ ...i, name: i.name.toUpperCase() }));
  }
}

module.exports = UserService;
