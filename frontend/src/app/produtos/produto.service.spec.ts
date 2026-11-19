import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Produto } from './produto.model';
import { ProdutoService } from './produto.service';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let http: HttpTestingController;
  const url = 'http://localhost:3000/api/products';
  const produto: Produto = {
    id: 12,
    nome: 'Teclado Gamer',
    descricao: 'Teclado para testes de integração',
    categoria: 'Periféricos',
    preco: 199.9,
    imagem: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProdutoService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('lista os produtos com GET', () => {
    let recebido: Produto[] | undefined;
    service.listar().subscribe((valor) => (recebido = valor));
    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([produto]);
    expect(recebido).toEqual([produto]);
  });
  it('consulta o produto pelo identificador com GET', () => {
    let recebido: Produto | undefined;
    service.buscarPorId(12).subscribe((valor) => (recebido = valor));
    const req = http.expectOne(`${url}/12`);
    expect(req.request.method).toBe('GET');
    req.flush(produto);
    expect(recebido).toEqual(produto);
  });
  it('cadastra o produto e preserva o corpo do POST', () => {
    let recebido: Produto | undefined;
    service.cadastrar(produto).subscribe((valor) => (recebido = valor));
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(produto);
    req.flush(produto, { status: 201, statusText: 'Created' });
    expect(recebido).toEqual(produto);
  });
  it('atualiza o produto e preserva o corpo do PUT', () => {
    const alterado = { ...produto, preco: 229.9 };
    let recebido: Produto | undefined;
    service.atualizar(12, alterado).subscribe((valor) => (recebido = valor));
    const req = http.expectOne(`${url}/12`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(alterado);
    req.flush(alterado);
    expect(recebido).toEqual(alterado);
  });
  it('exclui o produto com DELETE e aceita resposta 204', () => {
    let concluiu = false;
    service.excluir(12).subscribe(() => (concluiu = true));
    const req = http.expectOne(`${url}/12`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
    expect(concluiu).toBe(true);
  });
  it('propaga o erro 404 para a tela tratar produto inexistente', () => {
    let erro: HttpErrorResponse | undefined;
    service.buscarPorId(99999).subscribe({ error: (valor) => (erro = valor) });
    http
      .expectOne(`${url}/99999`)
      .flush({ erro: 'Produto não encontrado' }, { status: 404, statusText: 'Not Found' });
    expect(erro?.status).toBe(404);
    expect(erro?.error.erro).toBe('Produto não encontrado');
  });
  it('propaga a validação 400 do cadastro para a tela', () => {
    let erro: HttpErrorResponse | undefined;
    service.cadastrar({ ...produto, preco: 0 }).subscribe({ error: (valor) => (erro = valor) });
    http
      .expectOne(url)
      .flush({ erro: 'Dados inválidos' }, { status: 400, statusText: 'Bad Request' });
    expect(erro?.status).toBe(400);
  });
  it('propaga a falha de conexão com o servidor', () => {
    let erro: HttpErrorResponse | undefined;
    service.listar().subscribe({ error: (valor) => (erro = valor) });
    http.expectOne(url).error(new ProgressEvent('error'));
    expect(erro?.status).toBe(0);
  });
});
