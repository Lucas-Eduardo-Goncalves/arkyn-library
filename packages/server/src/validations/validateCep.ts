import { removeNonNumeric } from "@arkyn/shared";

/**
 * Validates a Brazilian CEP (Código de Endereçamento Postal).
 * A valid CEP has 8 numeric digits.
 *
 * @param {string} rawCep - CEP string, may include formatting (e.g., "12345-678").
 *
 * @returns {boolean} `true` if the CEP is valid, otherwise `false`.
 *
 * @example
 * ```typescript
 * validateCep("12345-678"); // true
 * validateCep("12345678");  // true
 * validateCep("ABCDE-123"); // false
 * ```
 */

function validateCep(rawCep: string): boolean {
  if (!rawCep) return false;

  const validFormat = /^\d{5}-\d{3}$/.test(rawCep) || /^\d{8}$/.test(rawCep);
  if (!validFormat) return false;

  const cep = removeNonNumeric(rawCep);

  const CEP_LENGTH = 8;
  const isOnlyDigits = /^\d{8}$/.test(cep);

  return cep.length === CEP_LENGTH && isOnlyDigits;
}

export { validateCep };
