import { removeNonNumeric } from "../services/removeNonNumeric";

/**
 * Formats a given string into a CPF (Cadastro de Pessoas Físicas) format.
 *
 * A CPF is a Brazilian individual taxpayer registry identification format.
 * This function ensures the input is cleaned of non-numeric characters and
 * then formats it into the standard CPF format: `XXX.XXX.XXX-XX`.
 *
 * @param {string} value -  The input string to be formatted as a CPF, the string must contain 11 numeric digits; special characters will be ignored.
 *
 * @returns {string} The formatted CPF string.
 *
 * @throws {Error} If the input string does not match the expected CPF format.
 *
 * @example
 * ```typescript
 * const formattedCpf = formatToCpf("12345678909");
 * console.log(formattedCpf); // Output: "123.456.789-09"
 * ```
 */

const formatToCpf = (value: string): string => {
  const cleaned = removeNonNumeric(value);
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

  const errorMessage = `CPF must be contain 11 numeric digits: ${value}`;
  if (!match) throw new Error(errorMessage);

  return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
};

export { formatToCpf };
