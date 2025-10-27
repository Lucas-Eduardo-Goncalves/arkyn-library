import { removeNonNumeric } from "@arkyn/shared";

type ValidateCepFunction = (rawCep: string) => boolean;

/**
 * Removes all non-digit characters from the CEP.
 * @param cep - Raw CEP string.
 * @returns Only numeric characters.
 */

/**
 * Validates a Brazilian CEP (Código de Endereçamento Postal).
 *
 * A valid CEP has 8 numeric digits.
 *
 * @param rawCep - CEP string, may include formatting (e.g., "12345-678").
 * @returns `true` if the CEP is valid, otherwise `false`.
 *
 * @example
 * ```ts
 * validateCep("12345-678"); // true
 * validateCep("12345678");  // true
 * validateCep("ABCDE-123"); // false
 * ```
 */

const validateCep: ValidateCepFunction = (rawCep) => {
  if (!rawCep) return false;

  const validFormat = /^[0-9-]+$/.test(rawCep);
  if (!validFormat) return false;

  const cep = removeNonNumeric(rawCep);

  const CEP_LENGTH = 8;
  const isOnlyDigits = /^\d{8}$/.test(cep);

  return cep.length === CEP_LENGTH && isOnlyDigits;
};

export { validateCep };
