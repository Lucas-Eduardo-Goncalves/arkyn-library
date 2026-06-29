/**
 * Truncates a given text to a specified maximum length and appends an ellipsis ("...")
 * if the text exceeds the maximum length.
 *
 * @param text - The input string to be truncated.
 * @param maxLength - Maximum allowed length before truncation.
 * @returns The truncated string with `"..."` appended, or the original string if it fits.
 * @example
 * ```typescript
 * const result = formatToEllipsis("Hello, world!", 5);
 * console.log(result); // Output: "Hello..."
 * ```
 */

function formatToEllipsis(text: string, maxLength: number): string {
	if (text.length > maxLength) {
		let trimmedText = text.substring(0, maxLength);

		// Find the last space to avoid breaking words
		const lastSpaceIndex = trimmedText.lastIndexOf(" ");
		if (lastSpaceIndex > 0) {
			trimmedText = trimmedText.substring(0, lastSpaceIndex);
		}

		// Remove trailing punctuation
		trimmedText = trimmedText.replace(/[\s.,!?;:]+$/, "");

		// If after removing punctuation the text is empty or only contains punctuation/spaces, return only "..."
		if (trimmedText.trim().length === 0 || /^[.,!?;:\s]+$/.test(trimmedText)) {
			return "...";
		}

		return `${trimmedText}...`;
	}

	return text;
}

export { formatToEllipsis };
