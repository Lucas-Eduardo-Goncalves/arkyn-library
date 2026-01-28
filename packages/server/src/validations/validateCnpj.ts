import { removeNonNumeric } from "@arkyn/shared";

function isInvalidLength(cnpj: string) {
  const CNPJ_LENGTH = 14;
  return cnpj.length !== CNPJ_LENGTH;
}

function hasAllDigitsEqual(cnpj: string) {
  const [firstDigit] = cnpj;
  return [...cnpj].every((digit) => digit === firstDigit);
}

function calculateDigit(cnpj: string, multipliers: number[]) {
  let total = 0;
  for (let i = 0; i < multipliers.length; i++) {
    total += parseInt(cnpj[i]) * multipliers[i];
  }
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function extractDigit(cnpj: string) {
  return cnpj.slice(12);
}

/**
 * Validates a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica) number.
 *
 * This function performs:
 * - Sanitization (removes non-digit characters).
 * - Length check (must be 14 digits).
 * - Repeating digits check (invalid if all digits are the same).
 * - Verifies the two check digits with the proper weights.
 *
 * @param {string} rawCnpj - CNPJ string, possibly formatted.
 *
 * @returns {boolean} `true` if valid, otherwise `false`.
 *
 * @example
 * ```typescript
 * validateCnpj("12.345.678/0001-95"); // false
 * validateCnpj("11.444.777/0001-61"); // true
 * ```
 */

function validateCnpj(rawCnpj: string): boolean {
  if (!rawCnpj) return false;
  if (rawCnpj.length > 18) return false;
  if (rawCnpj.length < 14) return false;

  const hasSpaces = /\s/.test(rawCnpj);
  if (hasSpaces) return false;

  const cnpj = removeNonNumeric(rawCnpj);

  if (isInvalidLength(cnpj)) return false;
  if (hasAllDigitsEqual(cnpj)) return false;

  const base = cnpj.slice(0, 12);
  const digit1 = calculateDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digit2 = calculateDigit(
    base + digit1,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return extractDigit(cnpj) === `${digit1}${digit2}`;
}

export { validateCnpj };
