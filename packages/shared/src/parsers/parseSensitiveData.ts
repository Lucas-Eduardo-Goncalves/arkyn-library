/**
 * Masks sensitive data in a JSON string by replacing the values of specified keys with "****".
 *
 * @param jsonString - The JSON string to be processed.
 * @param sensitiveKeys - Keys whose values will be replaced with `"****"`. Defaults to `["password", "confirmPassword", "creditCard"]`.
 * @returns A JSON string with sensitive values masked. Returns the original string if it is not valid JSON.
 *
 * @example
 * ```typescript
 * const jsonString = JSON.stringify({
 *   username: "user123",
 *   password: "secret",
 *   profile: { creditCard: "1234-5678-9012-3456" },
 * });
 *
 * const result = parseSensitiveData(jsonString, ["password", "creditCard"]);
 * console.log(result); // Output: '{"username":"user123","password":"****","profile":{"creditCard":"****"}}'
 * ```
 */

function parseSensitiveData(
	jsonString: string,
	sensitiveKeys: string[] = ["password", "confirmPassword", "creditCard"],
): string {
	function maskValue(key: string, value: any): any {
		if (sensitiveKeys.includes(key)) return "****";
		return value;
	}

	function recursiveMask(obj: any): any {
		if (Array.isArray(obj)) {
			return obj.map((item) => recursiveMask(item));
		} else if (obj !== null && typeof obj === "object") {
			return Object.keys(obj).reduce((acc, key) => {
				let value = obj[key];
				if (typeof value === "string") {
					try {
						const parsedValue = JSON.parse(value);
						if (typeof parsedValue === "object") {
							value = JSON.stringify(recursiveMask(parsedValue));
						}
					} catch (_e) {}
				}
				acc[key] = recursiveMask(maskValue(key, value));
				return acc;
			}, {} as any);
		}
		return obj;
	}

	try {
		const jsonObject = JSON.parse(jsonString);
		const maskedObject = recursiveMask(jsonObject);
		return JSON.stringify(maskedObject);
	} catch (_error) {
		return jsonString;
	}
}

export { parseSensitiveData };
