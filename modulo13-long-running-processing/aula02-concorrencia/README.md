Node Process e Modelo de Concorrencia

=> Thread Principal (Event Loop)
=> Event Loop (amontoado de threads)

=> Arquitetura Orientada à Eventos
=> Para tarefas pesadas => NodeJS envia para o Threads Pool

## Bloqueio de EventLooping
=> processamento em mémoria, pode dar ruim;
=> DoS

=> Alteração de Váriaveis só ocorre na thread principal (via NodeJS)
