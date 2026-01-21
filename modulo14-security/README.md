// Leitura Recomendada

https://blog.sqreen.com/nodejs-security-best-practices/
https://snyk.io/blog/what-is-package-lock-json/
https://snyk.io/blog/why-npm-lockfiles-can-be-a-security-blindspot-for-injecting-malicious-modules/
https://snyk.io/blog/open-source-npm-packages-colors-faker/
https://erickwendel.com/talk/detail/5fa9561af663f6a8b69a7a19
https://www.npmjs.com/package/express-rate-limit
https://snyk.io/blog/open-source-npm-packages-colors-faker/


Dicas

1 - RegeX
=> Evitar ataque de RegeX. => Safe RegeX => Valida antes de executar.
=> ESLINT => Valida regras de codigo.   => eslint-plugin-security-node

2 - Ataque em Pacotes NPM
=> Ataque de package-lock.json polution
=> Dev de Projetos Open Source

-- Injeção de Pacotes Malicioso

3 - Rotina de Atualização de Pacote
=> Bem manual.

4 - Nunca retorne mensagem de erro para o usuãrio

5 - Adicionar Rate Limit
    => API Gateway da AWS (Aplication Performance Monitoring)

6 - Evite Travar o Event Loop
  => Evitar processamento sincrono.
  => Não processar nada em memoria.
  => Sempre controlar o pool de tarefas.

7 - Segurança: é dificultar acesso do mal intencionado para acessar a aplicação.

=> Evitando Coding Inject em Node.JS