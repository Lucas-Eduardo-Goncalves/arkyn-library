const DIGIT = /^\d$/;

type DigitCharacterNode = {
	kind: "digit";
	digit: number;
	character: string;
};

type OtherCharacterNode = {
	kind: "other";
	character: string;
};

type RootCharacterNode = {
	kind: "root";
	digits: number;
	children: (DigitCharacterNode | OtherCharacterNode)[];
};

const parseToCharacters = (value: string): RootCharacterNode => {
	let digits = 0;

	const children = value
		.split("")
		.map((character: string): DigitCharacterNode | OtherCharacterNode => {
			if (DIGIT.test(character))
				return { character, kind: "digit", digit: ++digits };
			return { character, kind: "other" };
		});

	return { digits, children, kind: "root" };
};

const normalizeRange = (
	range: number | [number, number],
	limit: number,
): [number, number] => {
	if (Array.isArray(range)) return range;
	if (range >= 0) return [0, range];
	return [limit + 1 - Math.abs(range), limit];
};

const within = (range: [number, number], value: number): boolean =>
	value >= range[0] && value <= range[1];

/**
 * Replaces specific digits in a string with a masking character, leaving non-digit characters unchanged.
 *
 * @param value - The input string to mask.
 * @param options.range - Which digits to hide:
 *   - Positive number `n` — hides the first `n` digits.
 *   - Negative number `-n` — hides the last `n` digits.
 *   - Tuple `[start, end]` — hides digits from position `start` to `end` (inclusive, 1-indexed).
 *   - Defaults to `3`.
 * @param options.hider - The masking character. Defaults to `"*"`.
 * @returns The string with the specified digit positions replaced.
 *
 * @example
 * ```typescript
 * formatToHiddenDigits("123-456-7890", { range: 3 });         // "***-456-7890"
 * formatToHiddenDigits("123-456-7890", { range: [4, 6], hider: "#" }); // "123-###-7890"
 * ```
 */

function formatToHiddenDigits(
	value: string,
	options?: { range?: number | [number, number]; hider?: string },
): string {
	const characters = parseToCharacters(value);
	const range = normalizeRange(options?.range ?? 3, characters.digits);

	const mappedCharacters = characters.children.map((node) => {
		if (node.kind === "digit" && within(range, node.digit))
			return options?.hider ?? "*";
		return node.character;
	});

	return mappedCharacters.join("");
}

export { formatToHiddenDigits };
