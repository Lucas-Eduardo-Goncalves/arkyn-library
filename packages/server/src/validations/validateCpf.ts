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
 * Validates a Brazilian CPF number. Strips formatting, checks length, rejects
 * repeated-digit sequences, and verifies both check digits with the CPF algorithm.
 *
 * @param rawCpf - CPF string, with or without formatting (dots and dashes).
 * @returns `true` if the CPF is valid, otherwise `false`.
 *
 * @example
 * ```typescript
 * validateCpf("123.456.789-09"); // false
 * validateCpf("111.444.777-35"); // true
 * ```
 */

function validateCpf(rawCpf: string): boolean {
  if (!rawCpf) return false;
  if (rawCpf.length > 14) return false;
  if (rawCpf.length < 11) return false;

  const hasSpaces = /\s/.test(rawCpf);
  if (hasSpaces) return false;

  const cpf = removeNonNumeric(rawCpf);

  if (isInvalidLength(cpf)) return false;
  if (hasAllDigitsEqual(cpf)) return false;

  const digit1 = calculateDigit(cpf, 10);
  const digit2 = calculateDigit(cpf, 11);

  return extractDigit(cpf) === `${digit1}${digit2}`;
}

export { validateCpf };
