/**
 * Generates a hexadecimal color code based on the input string.
 * The function creates a hash from the string and uses it to calculate
 * RGB values, which are then converted to a hexadecimal color code.
 *
 * @param rawString - The input string used to generate the color.
 * @returns A hexadecimal color code (e.g., `"#a1b2c3"`) derived from the input string.
 *
 * @example
 * ```typescript
 * const color = generateColorByString("example");
 * console.log(color); // Outputs a consistent hex color like "#5e8f9a"
 * ```
 */

function generateColorByString(rawString: string): string {
	let hash = 0;

	for (let i = 0; i < rawString.length; i++) {
		hash = rawString.charCodeAt(i) + ((hash << 5) - hash);
	}

	const red = (hash & 0xff0000) >> 16;
	const green = (hash & 0x00ff00) >> 8;
	const blue = hash & 0x0000ff;

	const redHex = red.toString(16).padStart(2, "0");
	const greenHex = green.toString(16).padStart(2, "0");
	const blueHex = blue.toString(16).padStart(2, "0");

	return `#${redHex}${greenHex}${blueHex}`;
}

export { generateColorByString };
