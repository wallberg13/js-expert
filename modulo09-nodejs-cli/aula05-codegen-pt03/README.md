# Task Checklist

- [x] creates `src` main folder if it not exists
- [x] creates `repository` layer
- [x] creates `service` layer with `repository` as dependency
- [x] creates `factory` layer with `service` and `repository` returning its instances
- [x] can create multiples domains with a single comand
- [x] saves files as `camelCase` and classes as `PascalCase`
- [x] reaches **100% test coverage**
- [x] integration tests should validate files on disk as a valid JS class

# Como fazer com que o node instale o pacote em nossa máquina.

- npm link > gera o "bin", dizendo para onde o mesmo será apontado.
- npm unlink -g > remove o link do bin.
