## Requisitos
- OpenSLL
- MongoDB
- Node

## Intruções

1) Criar um diretório chamado keys:

mkdir keys

2) navegar até esse diretório e digitar o seguinte comando para criar uma chave privada de 2048 bits:

openssl genrsa -out server.key 2048

3) Depois digitar o comando abaixo e preencher os dados para gerar o certificado:

openssl req -new -sha256 -key server.key -out server.cert -days 300

4) Copiar a pasta keys para dentro da pasta do seu projeto

5) Importar os módulos htpps e fs:

const https = require('https')

const fs = require('fs')

6) Criar um objeto options que receberá a chave e o certificado:

var options = { \
    key: fs.readFileSync('./keys/server.key'), \
    cert: fs.readFileSync('./keys/server.cert') \
}

7) Criar o servidor https passando como parâmetro options e a variável em que você chamou o express:

const app = express()

...

...

...

https.createServer(options, app).listen(3000, () => {
    console.log('Olá mundo')
})

8) Abrir a linha de comando do mongoDB:

mongo

9) Iniciar o serviço do mongoDB:

sudo systemctl start mongod

10) Criar um banco de dados chamado agencia:

use agencia

11) Criar uma coleção chamada usuarios e já inserir o nome de usuário e a senha:

db.usuarios.insert({"nome" : "admin", "senha" : "$2a$10$uPRe3XfSJugEOpoQwInTTuzLw3eS4pUXSqcR2oHJ6KzSf3Pk/JD9m"})

## Para rodar a aplicação

OBS: o serviço do mongoDB deve estar rodando, caso não esteja digitar no terminal sudo systemctl start mongod

1) Para rodar o node:

npm run dev

2) Abrir no navegador o link: https://localhost:3000/usuarios/login, em seguida preencher o nome de usuário com admin e a senha com teste123



