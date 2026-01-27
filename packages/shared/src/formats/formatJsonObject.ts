/**
 * Formats a JSON object into a human-readable string with proper indentation.
 *
 * - If the input is an object, it will be formatted with keys and values properly indented.
 * - If the input is an array, each element will be formatted and indented on a new line.
 * - If the input is a string that can be parsed as JSON, it will attempt to parse and format it.
 * - Primitive values (e.g., numbers, booleans, null) will be converted to their string representation.
 *
 * @param {any} json - The JSON object or value to format. It can be an object, array, string, or primitive value.
 * @param {number} indentLevel - The current level of indentation to apply. This is used recursively to format nested structures.
 *
 * @returns {string} A formatted string representation of the JSON object.
 *
 * @example
 * ```typescript
 * const obj = { name: "John", age: 30, hobbies: ["reading", "gaming"] };
 * const formatted = formatJsonObject(obj, 0);
 * console.log(formatted);
 * // Output:
 * // {
 * //   "name": "John",
 * //   "age": 30,
 * //   "hobbies": [
 * //     "reading",
 * //     "gaming"
 * //   ]
 * // }
 * ```
 */

const formatJsonObject = (json: any, indentLevel: number): string => {
  const indent = "  ".repeat(indentLevel);
  let formattedString = "";

  if (typeof json === "object" && json !== null) {
    if (Array.isArray(json)) {
      if (json.length === 0) {
        // Caso especial para arrays vazios
        formattedString += "[]";
      } else {
        formattedString += "[\n";
        json.forEach((item, index) => {
          formattedString +=
            indent + "  " + formatJsonObject(item, indentLevel + 1);
          if (index < json.length - 1) {
            formattedString += ",";
          }
          formattedString += "\n";
        });
        formattedString += indent + "]";
      }
    } else {
      const keys = Object.keys(json);
      if (keys.length === 0) {
        // Caso especial para objetos vazios
        formattedString += "{}";
      } else {
        formattedString += "{\n";
        keys.forEach((key, index) => {
          formattedString +=
            indent +
            '  "' +
            key +
            '": ' +
            formatJsonObject(json[key], indentLevel + 1);
          if (index < keys.length - 1) {
            formattedString += ",";
          }
          formattedString += "\n";
        });
        formattedString += indent + "}";
      }
    }
  } else if (typeof json === "string") {
    try {
      const parsedObj = JSON.parse(json);
      formattedString += formatJsonObject(parsedObj, indentLevel);
    } catch {
      formattedString += '"' + json + '"';
    }
  } else {
    formattedString += json;
  }

  return formattedString;
};

export { formatJsonObject };
