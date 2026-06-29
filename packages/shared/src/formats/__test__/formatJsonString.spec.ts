import { describe, expect, it } from "vitest";
import { formatJsonString } from "../formatJsonString";

describe("formatJsonString", () => {
	it("should format simple JSON string", () => {
		const jsonString = '{"name":"John","age":30}';
		const result = formatJsonString(jsonString);
		const expected = `{
  "name": "John",
  "age": 30
}`;
		expect(result).toBe(expected);
	});

	it("should format JSON array string", () => {
		const jsonString = "[1,2,3]";
		const result = formatJsonString(jsonString);
		const expected = `[
  1,
  2,
  3
]`;
		expect(result).toBe(expected);
	});

	it("should format JSON string with array of objects", () => {
		const jsonString = '[{"name":"John","age":30},{"name":"Jane","age":25}]';
		const result = formatJsonString(jsonString);
		const expected = `[
  {
    "name": "John",
    "age": 30
  },
  {
    "name": "Jane",
    "age": 25
  }
]`;
		expect(result).toBe(expected);
	});

	it("should format JSON string with mixed types", () => {
		const jsonString =
			'{"string":"text","number":42,"boolean":true,"null":null,"array":[1,2,3]}';
		const result = formatJsonString(jsonString);
		const expected = `{
  "string": "text",
  "number": 42,
  "boolean": true,
  "null": null,
  "array": [
    1,
    2,
    3
  ]
}`;
		expect(result).toBe(expected);
	});

	it("should throw error for invalid JSON string", () => {
		const invalidJson = '{"name":"John", "age":30,';
		expect(() => formatJsonString(invalidJson)).toThrow("Invalid JSON string");
	});

	it("should throw error for malformed JSON string", () => {
		const malformedJson = '{name:"John"}';
		expect(() => formatJsonString(malformedJson)).toThrow(
			"Invalid JSON string",
		);
	});

	it("should format empty object string", () => {
		const jsonString = "{}";
		const result = formatJsonString(jsonString);
		expect(result).toBe("{}");
	});

	it("should format empty array string", () => {
		const jsonString = "[]";
		const result = formatJsonString(jsonString);
		expect(result).toBe("[]");
	});

	it("should format deeply nested JSON string", () => {
		const jsonString = '{"level1":{"level2":{"level3":{"value":"deep"}}}}';
		const result = formatJsonString(jsonString);
		const expected = `{
  "level1": {
    "level2": {
      "level3": {
        "value": "deep"
      }
    }
  }
}`;
		expect(result).toBe(expected);
	});

	it("should format JSON string with Unicode characters", () => {
		const jsonString = '{"emoji":"😀","chinese":"你好"}';
		const result = formatJsonString(jsonString);
		const expected = `{
  "emoji": "😀",
  "chinese": "你好"
}`;
		expect(result).toBe(expected);
	});

	it("should format JSON string with numbers", () => {
		const jsonString = '{"integer":42,"float":3.14,"negative":-10,"zero":0}';
		const result = formatJsonString(jsonString);
		const expected = `{
  "integer": 42,
  "float": 3.14,
  "negative": -10,
  "zero": 0
}`;
		expect(result).toBe(expected);
	});

	it("should format JSON string with boolean values", () => {
		const jsonString = '{"active":true,"deleted":false}';
		const result = formatJsonString(jsonString);
		const expected = `{
  "active": true,
  "deleted": false
}`;
		expect(result).toBe(expected);
	});

	it("should throw error for non-string input treated as JSON", () => {
		const notAString = "not json at all";
		expect(() => formatJsonString(notAString)).toThrow("Invalid JSON string");
	});

	it("should format already formatted JSON string", () => {
		const formattedJson = `{
  "name": "John",
  "age": 30
}`;
		const result = formatJsonString(formattedJson);
		const expected = `{
  "name": "John",
  "age": 30
}`;
		expect(result).toBe(expected);
	});

	it("should format minified JSON string", () => {
		const minified =
			'{"users":[{"id":1,"name":"John"},{"id":2,"name":"Jane"}],"total":2}';
		const result = formatJsonString(minified);
		const expected = `{
  "users": [
    {
      "id": 1,
      "name": "John"
    },
    {
      "id": 2,
      "name": "Jane"
    }
  ],
  "total": 2
}`;
		expect(result).toBe(expected);
	});

	it("should handle JSON string with null values", () => {
		const jsonString = '{"value":null,"nested":{"value":null}}';
		const result = formatJsonString(jsonString);
		const expected = `{
  "value": null,
  "nested": {
    "value": null
  }
}`;
		expect(result).toBe(expected);
	});

	it("should throw error for empty string", () => {
		expect(() => formatJsonString("")).toThrow("Invalid JSON string");
	});
});
