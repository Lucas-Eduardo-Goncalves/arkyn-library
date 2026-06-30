import { describe, expect, it } from "vitest";
import { formatJsonObject } from "../formatJsonObject";

describe("formatJsonObject", () => {
	it("should format simple object with one level", () => {
		const obj = { name: "John", age: 30 };
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "name": "John",
  "age": 30
}`;
		expect(result).toBe(expected);
	});

	it("should format nested object", () => {
		const obj = {
			name: "John",
			address: { city: "New York", zip: "10001" },
		};
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "name": "John",
  "address": {
    "city": "New York",
    "zip": 10001
  }
}`;
		expect(result).toBe(expected);
	});

	it("should format array of primitives", () => {
		const arr = [1, 2, 3];
		const result = formatJsonObject(arr, 0);
		const expected = `[
  1,
  2,
  3
]`;
		expect(result).toBe(expected);
	});

	it("should format array of objects", () => {
		const arr = [
			{ name: "John", age: 30 },
			{ name: "Jane", age: 25 },
		];
		const result = formatJsonObject(arr, 0);
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

	it("should format empty object", () => {
		const obj = {};
		const result = formatJsonObject(obj, 0);
		expect(result).toBe("{}");
	});

	it("should format empty array", () => {
		const arr: unknown[] = [];
		const result = formatJsonObject(arr, 0);
		expect(result).toBe("[]");
	});

	it("should format object with array property", () => {
		const obj = { name: "John", hobbies: ["reading", "gaming"] };
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "name": "John",
  "hobbies": [
    "reading",
    "gaming"
  ]
}`;
		expect(result).toBe(expected);
	});

	it("should format deeply nested object", () => {
		const obj = {
			level1: {
				level2: {
					level3: { value: "deep" },
				},
			},
		};
		const result = formatJsonObject(obj, 0);
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

	it("should format string values", () => {
		const obj = { message: "Hello World" };
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "message": "Hello World"
}`;
		expect(result).toBe(expected);
	});

	it("should format boolean values", () => {
		const obj = { active: true, deleted: false };
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "active": true,
  "deleted": false
}`;
		expect(result).toBe(expected);
	});

	it("should format null values", () => {
		const obj = { value: null };
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "value": null
}`;
		expect(result).toBe(expected);
	});

	it("should format number values", () => {
		const obj = { integer: 42, float: 3.14, negative: -10 };
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "integer": 42,
  "float": 3.14,
  "negative": -10
}`;
		expect(result).toBe(expected);
	});

	it("should parse and format JSON string", () => {
		const jsonString = '{"name":"John","age":30}';
		const result = formatJsonObject(jsonString, 0);
		const expected = `{
  "name": "John",
  "age": 30
}`;
		expect(result).toBe(expected);
	});

	it("should handle invalid JSON string as regular string", () => {
		const invalidJson = "not a json";
		const result = formatJsonObject(invalidJson, 0);
		expect(result).toBe('"not a json"');
	});

	it("should format mixed nested structures", () => {
		const obj = {
			users: [
				{ name: "John", active: true },
				{ name: "Jane", active: false },
			],
			metadata: { count: 2, timestamp: null },
		};
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "users": [
    {
      "name": "John",
      "active": true
    },
    {
      "name": "Jane",
      "active": false
    }
  ],
  "metadata": {
    "count": 2,
    "timestamp": null
  }
}`;
		expect(result).toBe(expected);
	});

	it("should handle object with special characters in keys", () => {
		const obj = { "key-with-dash": "value", key_with_underscore: "value" };
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "key-with-dash": "value",
  "key_with_underscore": "value"
}`;
		expect(result).toBe(expected);
	});

	it("should format array with mixed types", () => {
		const arr = [1, "string", true, null, { key: "value" }];
		const result = formatJsonObject(arr, 0);
		const expected = `[
  1,
  "string",
  true,
  null,
  {
    "key": "value"
  }
]`;
		expect(result).toBe(expected);
	});

	it("should handle zero as a value", () => {
		const obj = { count: 0 };
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "count": 0
}`;
		expect(result).toBe(expected);
	});

	it("should format object with single property", () => {
		const obj = { name: "John" };
		const result = formatJsonObject(obj, 0);
		const expected = `{
  "name": "John"
}`;
		expect(result).toBe(expected);
	});

	it("should format array with single element", () => {
		const arr = ["single"];
		const result = formatJsonObject(arr, 0);
		const expected = `[
  "single"
]`;
		expect(result).toBe(expected);
	});

	it("should handle custom indentation level", () => {
		const obj = { name: "John" };
		const result = formatJsonObject(obj, 2);
		const expected = `{
      "name": "John"
    }`;
		expect(result).toBe(expected);
	});
});
