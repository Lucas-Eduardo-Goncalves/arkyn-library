/**
 * Masks sensitive data in a JSON string by replacing the values of specified keys with "****".
 *
 * @param {string} jsonString - The JSON string to be processed.
 * @param {string[]} sensitiveKeys - An array of keys whose values should be masked. Defaults to `["password", "confirmPassword", "creditCard"]`.
 *
 * @returns {string} A JSON string with sensitive data masked. If the input is not a valid JSON string, it returns the original string.
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
          } catch (e) {}
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
  } catch (error) {
    return jsonString;
  }
}

export { parseSensitiveData };
