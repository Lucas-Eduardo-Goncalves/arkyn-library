/**
 * Verifica se uma string contém marcação HTML.
 *
 * Esta função utiliza uma expressão regular para detectar a presença de tags HTML
 * em uma string. A verificação é case-insensitive e detecta tanto tags de abertura
 * quanto de fechamento.
 *
 * @param str - A string a ser verificada
 * @returns `true` se a string contém marcação HTML, `false` caso contrário
 *
 * @example
 * ```typescript
 * isHtml('<p>Hello world</p>'); // true
 * isHtml('<div>Content</div>'); // true
 * isHtml('Plain text'); // false
 * isHtml('Text with <b>bold</b>'); // true
 * isHtml(''); // false
 * ```
 */

function isHtml(str: string): boolean {
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlRegex.test(str);
}

export { isHtml };
