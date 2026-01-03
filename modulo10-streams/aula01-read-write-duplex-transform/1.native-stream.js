// | => Pipe
// ls | grep "node" | xargs cat | jq .name ===> inputs e mais inputs, com pipeline...

// stdin

// Tudo que esta no in, vai para o out.
// => process.stdin.pipe(process.stdout);

// A stream, herda a interface do EventEmitter.
// Todo evento de informação, serã redirecionado para o str out com um console log.
// Watermark => Quantidade de Bytes que podem ser processados de vez.
//
//----------------------------------------------------------
// process.stdin
//   .pipe(process.stdout)
//   .on("data", function (msg) {
//     console.log("data => ", msg, msg.toString());
//   })
//   .on("error", (err) => console.log("error => ", err))
//   .on("end", (_) => console.log("end"))
//   .on("close", (_) => console.log("close"));
//----------------------------------------------------------

// Terminal 01
// Tudo de entrada de conexão, estou saindo para o terminal.
// node -e "require('net').createServer((socket) => socket.pipe(process.stdout)).listen(1338)"

// Terminal 02
// Tudo que está no in, está indo para a conexão "telnet" do servidor que acabei de criar.
// node -e "process.stdin.pipe(require('net').connect(1338))"

// Criando um arquivo grande de 1GB.
// node -e "process.stdout.write(crypto.randomBytes(5e9))" > big.file

/**
 * Teste 01: Leitura de arquivo grande sem utiliza os streams.
 * Jogando tudo na memoria.
 */
import http from "http";
import { createReadStream, readFileSync } from "fs";

http
  .createServer((req, res) => {
    /**
     * No momento do tostring, vamos jogar tudo na memoria,
     * e iramos quebrar o sistema. O que não é recomendado, seguindo uma má pratica.
     *
     * const file = readFileSync("big.file").toString();
     * res.write(file);
     * res.end();
     *
     */

    /**
     * Quando faço isso, o readStream pega o arquivo grande e vai jogando na resposta
     * via pipe, como se fosse enviar chunks de dados para o cliente.
     * O que é uma melhor prática, e não trava o sistema.
     */
    createReadStream("big.file").pipe(res);
  })
  .listen(3000, () => console.log("Server is running on port 3000"));
