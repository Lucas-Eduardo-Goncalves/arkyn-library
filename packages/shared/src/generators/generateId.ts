function hexToBin(hex: string) {
	hex = hex.replace(/-/g, "");
	const buffer = new Uint8Array(hex.length / 2);

	for (let i = 0; i < hex.length; i += 2) {
		buffer[i / 2] = parseInt(hex.substring(i, i + 2), 16);
	}

	return buffer;
}

function uuidV4() {
	const uuid = crypto.randomUUID();
	return { text: uuid, binary: hexToBin(uuid) };
}

function uuidV7() {
	const bytes = crypto.getRandomValues(new Uint8Array(16));

	const ts = BigInt(Date.now());

	bytes[0] = Number((ts >> 40n) & 0xffn);
	bytes[1] = Number((ts >> 32n) & 0xffn);
	bytes[2] = Number((ts >> 24n) & 0xffn);
	bytes[3] = Number((ts >> 16n) & 0xffn);
	bytes[4] = Number((ts >> 8n) & 0xffn);
	bytes[5] = Number(ts & 0xffn);

	// versão 7
	bytes[6] = (bytes[6] & 0x0f) | 0x70;

	// variante RFC 4122
	bytes[8] = (bytes[8] & 0x3f) | 0x80;

	const uuid = [...bytes]
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
		.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");

	return {
		text: uuid,
		binary: hexToBin(uuid),
	};
}

/**
 * Generates a UUID in the specified version and output type.
 *
 * @param type - Output representation: `"text"` (string) or `"binary"` (`Uint8Array`).
 * @param format - UUID version: `"v4"` (random) or `"v7"` (time-ordered).
 * @returns The UUID as a string or `Uint8Array` depending on `type`.
 *
 * @example
 * ```typescript
 * generateId("text", "v4");   // "550e8400-e29b-41d4-a716-446655440000"
 * generateId("binary", "v7"); // Uint8Array([...])
 * ```
 */
function generateId(type: "text", format: "v4" | "v7"): string;
function generateId(type: "binary", format: "v4" | "v7"): Uint8Array;
function generateId(
	type: "text" | "binary",
	format: "v4" | "v7",
): string | Uint8Array {
	if (type === "text" && format === "v4") return uuidV4().text;
	if (type === "binary" && format === "v4") return uuidV4().binary;
	if (type === "text" && format === "v7") return uuidV7().text;
	if (type === "binary" && format === "v7") return uuidV7().binary;
	throw new Error("Invalid type or format");
}

export { generateId };
