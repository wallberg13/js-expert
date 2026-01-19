Thread => 'um fio', memoria compartilhada
       => tudo compartilhado
       => Mais barato para o SO
       => No NodeJS => WorkerThreads
       => CPU Intensive Operation

Processo => Um programa independente.
         => Nada compartilhado.
         => Sempre mais caro para o SO (child process)
         => É mais interessante quando é para IO
         => Um processo pode ter X threads
         => Child Process