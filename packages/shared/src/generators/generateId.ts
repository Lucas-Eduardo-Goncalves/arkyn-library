import { v4, v7 } from "uuid";

function hexToBin(hex: string) {
  hex = hex.replace(/-/g, "");
  const buffer = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    buffer[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }

  return buffer;
}

function uuidV4() {
  const uuid = v4();
  return { text: uuid, binary: hexToBin(uuid) };
}

function uuidV7() {
  const uuid = v7();
  return { text: uuid, binary: hexToBin(uuid) };
}

/**
 * Generates a unique identifier (UUID) in the specified format and type.
 *
 * @param {"text" | "binary"} type - The desired output type of the UUID. Can be:
 *   - `"text"`: Returns the UUID as a string.
 *   - `"binary"`: Returns the UUID as a `Uint8Array` in binary format.
 * @param {"v4" | "v7"} format - The version of the UUID to generate. Can be:
 *   - `"v4"`: Generates a random UUID (version 4).
 *   - `"v7"`: Generates a time-ordered UUID (version 7).
 * @returns {string | Uint8Array} The generated UUID in the specified type and format.
 *   - If `type` is `"text"`, a string representation of the UUID is returned.
 *   - If `type` is `"binary"`, a `Uint8Array` representation of the UUID is returned.
 * @throws {Error} If an invalid `type` or `format` is provided.
 *
 * @example
 * // Generate a version 4 UUID as a string
 * const idTextV4 = generateId("text", "v4");
 * console.log(idTextV4); // e.g., "550e8400-e29b-41d4-a716-446655440000"
 *
 * @example
 * // Generate a version 7 UUID as binary
 * const idBinaryV7 = generateId("binary", "v7");
 * console.log(idBinaryV7); // Uint8Array([...])
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
