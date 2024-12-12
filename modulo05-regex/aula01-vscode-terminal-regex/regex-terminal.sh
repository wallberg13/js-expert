# A partir da pasta raiz
find . -name *.test.js # O name é uma expressão regular..
find . -name *.test.js -not -path '*node_modules**' # A node modules está fora do nosso controle, então ignoramos ele.
find . -name *.js -not -path '*node_modules**' # A node modules está fora do nosso controle, então ignoramos ele.

npm i -g ipt # IPT > painel iterativo, com seleção do que queremos

# O Pipe > a medida que os dados estão chegando, envia para o ipt.
find . -name *.js -not -path '*node_modules**' | ipt 

cp -r ../../modulo01-test/aula05-tdd-project-pt01 .



# ipt -o   => seleciono multiplos arquivos
# xargs -I => para cada linha, quero executar algo.
#          '{file}' => Como chamo cada linha, como se eu definisse uma variavel

# sed -i (replace no arquivo)
# 1s -> primeira linha
# ^  -> primeira coluna
# substitui pelo $CONTENT
# quebrou a linha para adicionar um \n implicitamente

# Com seleção
CONTENT="'use strict';"
find . -name *.js -not -path '*node_modules**' \
| ipt -o \
| xargs -I '{file}' sed -i "" -e "1s/^/$CONTENT\n/g" {file}

# Mudando tudo
CONTENT="'use strict';"
find . -name *.js -not -path '*node_modules**' \
| xargs -I '{file}' sed -i "" -e "1s/^/$CONTENT\n/g" {file}