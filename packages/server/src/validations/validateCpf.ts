import { removeNonNumeric } from "@arkyn/shared";

function isInvalidLength(cpf: string) {
  const CPF_LENGTH = 11;
  return cpf.length !== CPF_LENGTH;
}

function hasAllDigitsEqual(cpf: string) {
  const [firstCpfDigit] = cpf;
  return [...cpf].every((digit) => digit === firstCpfDigit);
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0;
  for (const digit of cpf) {
    if (factor > 1) total += parseInt(digit) * factor--;
  }
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function extractDigit(cpf: string) {
  return cpf.slice(9);
}

/**
 * Validates a Brazilian CPF (Cadastro de Pessoas Físicas) number.
 *
 * The CPF is a unique identifier assigned to Brazilian citizens and residents.
 * This function checks if the provided CPF is valid by performing the following steps:
 * - Removes any non-digit characters from the input.
 * - Verifies if the CPF has the correct length (11 digits).
 * - Ensures that all digits are not the same (e.g., "111.111.111-11" is invalid).
 * - Calculates the first and second verification digits using the CPF algorithm.
 * - Compares the calculated verification digits with the ones provided in the CPF.
 *
 * @param {string} rawCpf - The raw CPF string, which may include formatting characters (e.g., dots or dashes).
 *
 * @returns {boolean} `true` if the CPF is valid, otherwise `false`.
 *
 * @example
 * ```typescript
 * validateCpf("123.456.789-09"); // false
 * validateCpf("111.444.777-35"); // true
 * ```
 */

function validateCpf(rawCpf: string): boolean {
  if (!rawCpf) return false;
  const cpf = removeNonNumeric(rawCpf);

  if (isInvalidLength(cpf)) return false;
  if (hasAllDigitsEqual(cpf)) return false;

  const digit1 = calculateDigit(cpf, 10);
  const digit2 = calculateDigit(cpf, 11);

  return extractDigit(cpf) === `${digit1}${digit2}`;
}

export { validateCpf };
