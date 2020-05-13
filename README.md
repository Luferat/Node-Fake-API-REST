# Fake API REST em Node.js

API REST fake para teste de aplicativos CRUD que consomem APIs.

* [Instalando](#instalando)
* [Exemplos](#exemplos)
    * [post()](#post)
    * [get()](#get)
    * [put()](#put)
    * [delete()](#delete)
* [Testes](#delete)

## Instalando

1. Verifique se o Node.js e o NPM estão instalados;
2. Clone o repositório;
3. Acesse o diretório onde o repositório foi clonado;
4. Instale as dependencias, comandando:

    ```sh 
    npm install --save
    ```
5. Rode o servidor, comandando:
 
    ```sh
    node index.js
    ```

## Exemplos

A API suporta registros com o seguintes dados:

- `id : [Integer]`
- `name : [String]`
- `email : [String]`
- `avatar: [String]`
- `status : [Integer]`
- `date: [Date]`

> Os valores das chaves 'id' e 'date' são geradas automaticamente na inserção (POST).

> O valor da chave 'date' é gerado automaticamente na atualização (PUT).

### post()

Para inserir um novo registro.

#### Requisição
##### URL:
```
http://localhost:8888/api
```
##### Body (JSON):
```
{
	"name" : "Joca da Silva",
	"email" : "joca@silva.com",
	"avatar" : "https://s3.amazonaws.com/uifaces/faces/twitter/hebertialmeida/128.jpg",
	"status" : 1
}
```

> Os valores das chaves 'id' e 'date' são geradas automaticamente na inserção (POST).

#### Resposta bem sucedida

```
{
    "status": "success",
    "result": "Record successfully added"
} 
```
#### Resposta de falha

```
{
    "status": "fail",
    "result": "ERROR_MESSAGE"
} 
```
> ERROR_MESSAGE varia conforme o erro obtido.
 
### get()
 Para listar os registros.
 
 #### Requisição
 
 Para listar todos os registros:
 
```
http://localhost:8888/api
```
ou
```
http://localhost:8888/api?id=0
```

Para listar um registro específico, por exemplo, o registro com `id = 5`:

```
http://localhost:8888/api?id=5
```
 
 #### Resposta bem sucedida
 Caso não encontre o(s) registro(s):
```
{
   "status": "success",
   "result": "No record found"
} 
``` 
Se encontrar o(s) registro(s):
```
{
    "status": "success",
    "result": [
        {
            "name": "Setembrino Trocatapas",
            "email": "set@brino.com",
            "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/mrmoiree/128.jpg",
            "status": "1",
            "id": 1,
            "date": "2020-04-23T23:45:02.832Z"
        },
        {
            "name": "Dilermano",
            "email": "diler@mano.com",
            "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/vivekprvr/128.jpg",
            "status": "1",
            "id": 2,
            "date": "2020-04-23T23:45:36.528Z"
        },
        ...
    ]
}
```
#### Resposta de falha

```
{
    "status": "fail",
    "result": "ERROR_MESSAGE"
} 
```
> ERROR_MESSAGE varia conforme o erro obtido.

### put()
Para atualizar um registro existente.
#### Requisição
##### URL:
```
http://localhost:8888/api
```
##### Body (JSON):
```
{
	"id" : 1,
	"name" : "Joca da Silva",
	"email" : "joca@silva.com",
	"avatar" : "https://s3.amazonaws.com/uifaces/faces/twitter/hebertialmeida/128.jpg",
	"status" : 0
}
```

> O valor da chave 'date' é gerado automaticamente na atualização (PUT).

#### Resposta bem sucedida
```
{
    "status": "success",
    "result": "Record successfully edited"
}
```
#### Resposta de falha

```
{
    "status": "fail",
    "result": "ERROR_MESSAGE"
} 
```
> ERROR_MESSAGE varia conforme o erro obtido.

### delete()
Para remover um registro existente.
#### Requisição
`http://localhost:8888/api?id=1`
#### Resposta bem sucedida

```
{
    "status": "success",
    "result": "Record deleted successfully"
}
```
#### Resposta de falha

```
{
    "status": "fail",
    "result": "ERROR_MESSAGE"
} 
```
> ERROR_MESSAGE varia conforme o erro obtido.

## Testes
Use o [Postman](https://www.postman.com/downloads/) para testar o funcionamento da aplicação.
