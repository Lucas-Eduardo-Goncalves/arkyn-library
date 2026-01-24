import { removeNonNumeric } from "../services/removeNonNumeric";

type FormatToCnpjFunction = (value: string) => string;

/**
 * Formats a given string or number into a CNPJ (Cadastro Nacional da Pessoa Jurídica) format.
 *
 * The CNPJ format is: `XX.XXX.XXX/XXXX-XX`, where `X` represents a digit.
 *
 * @param {string} value - The input string to be formatted as a CNPJ, the string must contain 14 numeric digits; special characters will be ignored.
 *
 * @returns {string} The formatted CNPJ string in the pattern `XX.XXX.XXX/XXXX-XX`.
 *
 * @throws {Error} Throws an error if the input does not contain exactly 14 numeric digits.
 *
 * @example
 * ```typescript
 * const formattedCnpj = formatToCnpj("12345678000195");
 * console.log(formattedCnpj); // Output: "12.345.678/0001-95"
 * ```
 */

const formatToCnpj: FormatToCnpjFunction = (value: string): string => {
  const cleaned = removeNonNumeric(value);
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);

  const errorMessage = `CNPJ must be contain 14 numeric digits: ${value}`;
  if (!match) throw new Error(errorMessage);

  return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
};

export { formatToCnpj };
