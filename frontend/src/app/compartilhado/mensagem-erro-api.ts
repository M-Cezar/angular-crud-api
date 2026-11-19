import { HttpErrorResponse } from '@angular/common/http';

export function mensagemErroApi(erro: unknown, mensagemPadrao: string): string {
  if (erro instanceof HttpErrorResponse) {
    if (erro.status === 0) {
      return 'Não foi possível conectar ao servidor. Verifique se o Back-End está em execução.';
    }
    const detalhe = erro.error?.erro;
    if (typeof detalhe === 'string' && detalhe.trim()) return detalhe;
  }
  return mensagemPadrao;
}
