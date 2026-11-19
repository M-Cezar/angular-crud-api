import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { ProdutoFormularioComponent } from './produto-formulario.component';

describe('Formulário de produto', () => {
  let fixture: ComponentFixture<ProdutoFormularioComponent>;
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

  function abrir(id?: string): void {
    TestBed.configureTestingModule({
      imports: [ProdutoFormularioComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } },
        },
      ],
    });
    fixture = TestBed.createComponent(ProdutoFormularioComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }
  function preencher(): void {
    const values = {
      nome: produto.nome,
      descricao: produto.descricao,
      categoria: produto.categoria,
      preco: String(produto.preco),
    };
    for (const [id, valor] of Object.entries(values)) {
      const campo = fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;
      campo.value = valor;
      campo.dispatchEvent(new Event('input', { bubbles: true }));
    }
    fixture.detectChanges();
  }
  function enviar(): void {
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }
  afterEach(() => {
    http.verify();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('impede o envio quando os campos obrigatórios estão vazios', () => {
    abrir();
    expect(fixture.nativeElement.querySelector('#btnCadastrar').disabled).toBe(true);
    http.expectNone(url);
  });
  it('envia o POST do formulário e mostra a confirmação de cadastro', () => {
    abrir();
    preencher();
    vi.useFakeTimers();
    enviar();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.nome).toBe(produto.nome);
    expect(req.request.body.preco).toBe(produto.preco);
    req.flush(produto, { status: 201, statusText: 'Created' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Produto cadastrado com sucesso!');
  });
  it('mostra a mensagem de validação recebida do servidor', () => {
    abrir();
    preencher();
    enviar();
    http
      .expectOne(url)
      .flush({ erro: 'Preço inválido para cadastro.' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Preço inválido para cadastro.');
    expect(fixture.nativeElement.textContent).not.toContain('Produto cadastrado com sucesso!');
  });
  it('carrega um produto para edição e confirma o PUT', () => {
    abrir('12');
    http.expectOne(`${url}/12`).flush(produto);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#nome').value).toBe('Teclado');
    vi.useFakeTimers();
    enviar();
    const req = http.expectOne(`${url}/12`);
    expect(req.request.method).toBe('PUT');
    req.flush(produto);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Produto atualizado com sucesso!');
  });
  it('explica a falha de conexão sem exibir uma confirmação de sucesso', () => {
    abrir();
    preencher();
    enviar();
    http.expectOne(url).error(new ProgressEvent('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Não foi possível conectar ao servidor.');
    expect(fixture.nativeElement.textContent).not.toContain('Produto cadastrado com sucesso!');
  });
});
