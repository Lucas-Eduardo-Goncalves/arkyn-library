import { removeNonNumeric } from "../utilities/removeNonNumeric";

/**
 * Formats a given string into a Brazilian postal code (CEP) format.
 *
 * The function removes all non-numeric characters from the input string
 * and attempts to format it as a CEP in the pattern `XXXXX-XXX`.
 * If the input does not match the expected format, an error is thrown.
 *
 * @param value - Input string with 8 numeric digits (special characters are stripped).
 * @returns The formatted CEP string in the pattern `XXXXX-XXX`.
 *
 * @throws {Error} If the input does not match the expected CEP format.
 *
 * @example
 * ```typescript
 * const formattedCep = formatToCep("12345678");
 * console.log(formattedCep); // Output: "12345-678"
 * ```
 */

function formatToCep(value: string): string {
	const cleaned = removeNonNumeric(value);
	const match = cleaned.match(/^(\d{5})(\d{3})$/);

	const errorMessage = `CEP must be contain 8 numeric digits: ${value}`;
	if (!match) throw new Error(errorMessage);

	return `${match[1]}-${match[2]}`;
}

export { formatToCep };
