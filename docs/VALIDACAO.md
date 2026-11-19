# Registro de validação

Validação realizada em 18/11/2026 para a atividade Interação com APIs T04 DF.

| Verificação | Resultado |
| --- | --- |
| Testes Angular/Vitest | 20 testes aprovados em 4 arquivos |
| Requisições da coleção Postman, executada com Newman | 12 concluídas, sem falhas |
| Asserções da coleção | 25 aprovadas, sem falhas |
| Compilação de produção Angular | Concluída, código de saída 0 |
| Dados originais do Back-End após os testes | Preservados |

Ambiente: Node.js v24.22.3, npm 11.9.0 e Newman 6.2.3. Os testes de componentes foram executados pelo Angular/Vitest com DOM de teste e HTTP simulado. As requisições da coleção foram enviadas à API Express em execução local.

Os casos de sucesso cobrem listar, consultar, cadastrar, atualizar e excluir produtos. Os casos de erro cobrem cadastro inválido, identificador inexistente, repetição de exclusão e falta de conexão. Nas telas, também foram verificados o formulário obrigatório e o cancelamento da confirmação de exclusão.

A compilação terminou com um aviso de tamanho: o pacote inicial ficou em 588,98 kB, acima do limite de aviso de 500 kB configurado no projeto. Isso não impediu a geração dos arquivos. O limite não foi alterado.

Os registros completos estão na pasta `evidencias`. Não foi realizada validação manual em navegador nesta rodada.
