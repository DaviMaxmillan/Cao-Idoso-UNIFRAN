/**
 * Formata o WhatsApp (guardado só com dígitos) no padrão brasileiro, como
 * aparece nos mockups: (16) 99123-4567.
 */
export function formatWhatsapp(digitos: string) {
  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);

  if (resto.length !== 8 && resto.length !== 9) return digitos;

  const meio = resto.slice(0, resto.length - 4);
  const fim = resto.slice(-4);
  return `(${ddd}) ${meio}-${fim}`;
}
