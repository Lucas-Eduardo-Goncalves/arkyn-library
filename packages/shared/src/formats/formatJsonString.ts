import { formatJsonObject } from "./formatJsonObject";

type FormatJsonStringFunction = (jsonString: string) => string;

/**
 * Parses a JSON string and returns a human-readable pretty-printed representation.
 * Throws if the input is not valid JSON.
 *
 * @param jsonString - A valid JSON string to format.
 * @returns A pretty-printed string representation.
 *
 * @example
 * ```typescript
 * formatJsonString('{"name":"John","hobbies":["reading","gaming"]}');
 * // {
 * //   "name": "John",
 * //   "hobbies": [
 * //     "reading",
 * //     "gaming"
 * //   ]
 * // }
 * ```
 */

const formatJsonString: FormatJsonStringFunction = (jsonString) => {
	try {
		const jsonObject = JSON.parse(jsonString);
		return formatJsonObject(jsonObject, 0);
	} catch (error) {
		throw new Error(`Invalid JSON string \n ${error}`);
	}
};

export { formatJsonString };
