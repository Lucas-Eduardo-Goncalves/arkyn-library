import { removeNonNumeric } from "@arkyn/shared";

/**
 * Validates a Brazilian CEP (postal code).
 *
 * A valid CEP must contain exactly 8 numeric digits,
 * optionally formatted as "12345-678".
 *
 * @param rawCep - CEP value, with or without formatting.
 * @returns `true` if the CEP is valid, otherwise `false`.
 *
 * @example
 * ```typescript
 * validateCep("12345-678"); // true
 * validateCep("12345678");  // true
 * validateCep("ABCDE-123"); // false
 * ```
 */

function validateCep(rawCep: string): boolean {
  const validFormat = /^\d{5}-\d{3}$/.test(rawCep) || /^\d{8}$/.test(rawCep);
  if (!validFormat) return false;

  const cep = removeNonNumeric(rawCep);

  const CEP_LENGTH = 8;
  const isOnlyDigits = /^\d{8}$/.test(cep);

  return cep.length === CEP_LENGTH && isOnlyDigits;
}

export { validateCep };
