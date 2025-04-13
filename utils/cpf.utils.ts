/**
 * Valida um CPF conforme as regras oficiais
 * @param cpf - String contendo o CPF a ser validado (pode conter formatação)
 * @returns Retorna true se o CPF é válido, false caso contrário
 */
export function validateCpf(cpf: string): boolean {
  // Remove todos os caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, '');

  // Verifica se tem 11 dígitos ou se todos são iguais (caso inválido)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  /**
   * Calcula um dígito verificador do CPF
   * @param cpf - String contendo os dígitos do CPF
   * @param weight - Array com os pesos para cálculo do dígito
   * @returns Dígito calculado
   */
  const calcDigit = (cpf: string, weight: number[]): number => {
    const sum = weight.reduce((acc, w, i) => acc + parseInt(cpf.charAt(i)) * w, 0);
    const digit = (sum * 10) % 11;
    return digit === 10 || digit === 11 ? 0 : digit;
  };

  // Verifica se os dígitos verificadores batem com os calculados
  const isValid =
    calcDigit(cpf, [10, 9, 8, 7, 6, 5, 4, 3, 2]) === parseInt(cpf.charAt(9)) &&
    calcDigit(cpf, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]) === parseInt(cpf.charAt(10));

  return isValid;
}

/**
 * Formata um CPF válido no padrão XXX.XXX.XXX-XX
 * (Assume que o input já foi validado pelo validateCpf)
 * 
 * @param cpf - String de CPF válido (11 dígitos, já verificado)
 * @returns CPF formatado no padrão brasileiro
 * 
 * @example
 * formatCpf('12345678909') → '123.456.789-09'
 */
export function formatCpf(cpf: string): string {
  const digitsOnly = cpf.replace(/\D/g, '');
  return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}