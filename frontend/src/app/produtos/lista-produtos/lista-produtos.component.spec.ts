import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { ListaProdutosComponent } from './lista-produtos.component';

describe('Lista de produtos', () => {
  let fixture: ComponentFixture<ListaProdutosComponent>;
  let http: HttpTestingController;
  const url = 'http://localhost:3000/api/products';
  const produto = {
    id: 12,
    nome: 'Teclado',
    descricao: 'Teclado gamer',
    categoria: 'Periféricos',
    preco: 199.9,
    imagem: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListaProdutosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    fixture = TestBed.createComponent(ListaProdutosComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  function carregarProduto(): void {
    http.expectOne(url).flush([produto]);
    fixture.detectChanges();
  }

  it('mostra na tela os produtos recebidos da API', () => {
    carregarProduto();
    expect(fixture.nativeElement.querySelector('article h2').textContent).toContain('Teclado');
  });

  it('explica a falha quando a listagem não consegue acessar o servidor', () => {
    http.expectOne(url).error(new ProgressEvent('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Não foi possível conectar ao servidor.');
  });

  it('exclui o produto confirmado, recarrega a lista e mostra a mensagem de sucesso', () => {
    carregarProduto();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fixture.nativeElement.querySelector('article button').click();
    const requisicao = http.expectOne(`${url}/12`);
    expect(requisicao.request.method).toBe('DELETE');
    requisicao.flush(null, { status: 204, statusText: 'No Content' });
    http.expectOne(url).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('article')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Produto excluído com sucesso!');
  });

  it('mostra a falha da exclusão e mantém o produto na tela', () => {
    carregarProduto();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fixture.nativeElement.querySelector('article button').click();
    http
      .expectOne(`${url}/12`)
      .flush({ erro: 'Produto não encontrado' }, { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Produto não encontrado');
    expect(fixture.nativeElement.querySelector('article')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Produto excluído com sucesso!');
  });

  it('não envia DELETE quando a exclusão é cancelada', () => {
    carregarProduto();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    fixture.nativeElement.querySelector('article button').click();
    http.expectNone(`${url}/12`);
    expect(fixture.nativeElement.querySelector('article')).not.toBeNull();
  });
});
