# CRUD de produtos — Interação com APIs

**Aluno:** Kaio Cézar Machado

**Turma:** Interação com APIs T04 DF

Atividade desenvolvida a partir do [projeto disponibilizado pela professora](https://github.com/HevelinFR/angular-crud-api). O sistema usa Angular no Front-End e Node.js com Express no Back-End para consultar e gerenciar produtos.

## Integração

O `ProdutoService` usa o `HttpClient` para as cinco operações:

| Método do serviço | Requisição | Finalidade |
| --- | --- | --- |
| `listar()` | `GET /api/products` | Listar produtos |
| `buscarPorId(id)` | `GET /api/products/:id` | Carregar um produto para edição |
| `cadastrar(produto)` | `POST /api/products` | Cadastrar um produto |
| `atualizar(id, produto)` | `PUT /api/products/:id` | Salvar as alterações |
| `excluir(id)` | `DELETE /api/products/:id` | Excluir após confirmação |

Revisei as chamadas HTTP presentes na base e retirei comentários que ainda indicavam implementação pendente. Também ajustei o tratamento de erros nas telas: quando a API informa o motivo da falha, essa mensagem é exibida; quando o servidor está indisponível, a tela orienta a verificar a conexão com o Back-End. As confirmações de cadastro, atualização e exclusão foram mantidas.

As telas, o Bootstrap e a API fornecidos no projeto foram aproveitados. O código do Back-End não foi alterado.

## Como executar

Use Node.js 24 LTS e dois terminais, ambos iniciando na raiz do repositório.

No primeiro terminal:

```bash
npm --prefix backend ci
npm --prefix backend run dev
```

No segundo terminal:

```bash
npm --prefix frontend ci
npm --prefix frontend start
```

Abra `http://localhost:4200`. A API atende em `http://localhost:3000/api/products`.

## Testes

Para instalar a ferramenta de execução da coleção Postman:

```bash
npm ci
```

Com a porta 3000 livre, execute:

```bash
npm run test:api
npm run test:frontend
npm run build
```

O teste da API inicia o servidor, executa a coleção e restaura o arquivo original de produtos ao terminar. Os dados de teste são fictícios. O teste do Front-End verifica o serviço e os componentes em ambiente de teste Angular com HTTP simulado.

A coleção também pode ser importada no Postman: [CRUD_Produtos.postman_collection.json](docs/CRUD_Produtos.postman_collection.json). Nesse caso, inicie o Back-End e execute a coleção completa na ordem apresentada, com `baseUrl` igual a `http://localhost:3000`.

Os resultados executados estão em [docs/evidencias](docs/evidencias). A coleção cobre cadastro, consulta, atualização e exclusão, além de dados inválidos e produtos inexistentes. Os testes Angular verificam as requisições, a validação do formulário, as mensagens de sucesso e erro e o cancelamento da exclusão.

As [orientações originais](docs/ORIENTACOES_ORIGINAIS.md) foram preservadas para consulta.
