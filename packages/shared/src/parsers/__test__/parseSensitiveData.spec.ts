import { describe, expect, it } from "vitest";
import { parseSensitiveData } from "../parseSensitiveData";

describe("parseSensitiveData", () => {
	it("should mask default sensitive keys", () => {
		const json = JSON.stringify({
			username: "user123",
			password: "secret",
			confirmPassword: "secret",
			creditCard: "1234-5678-9012-3456",
		});
		const result = parseSensitiveData(json);
		const parsed = JSON.parse(result);
		expect(parsed.username).toBe("user123");
		expect(parsed.password).toBe("****");
		expect(parsed.confirmPassword).toBe("****");
		expect(parsed.creditCard).toBe("****");
	});

	it("should mask custom sensitive keys", () => {
		const json = JSON.stringify({
			username: "user123",
			apiKey: "secret-key",
			token: "abc123",
		});
		const result = parseSensitiveData(json, ["apiKey", "token"]);
		const parsed = JSON.parse(result);
		expect(parsed.username).toBe("user123");
		expect(parsed.apiKey).toBe("****");
		expect(parsed.token).toBe("****");
	});

	it("should handle nested objects", () => {
		const json = JSON.stringify({
			user: {
				name: "John",
				password: "secret",
				profile: {
					email: "john@example.com",
					creditCard: "1234-5678",
				},
			},
		});
		const result = parseSensitiveData(json);
		const parsed = JSON.parse(result);
		expect(parsed.user.name).toBe("John");
		expect(parsed.user.password).toBe("****");
		expect(parsed.user.profile.email).toBe("john@example.com");
		expect(parsed.user.profile.creditCard).toBe("****");
	});

	it("should handle arrays", () => {
		const json = JSON.stringify([
			{ id: 1, password: "pass1" },
			{ id: 2, password: "pass2" },
		]);
		const result = parseSensitiveData(json);
		const parsed = JSON.parse(result);
		expect(parsed[0].id).toBe(1);
		expect(parsed[0].password).toBe("****");
		expect(parsed[1].id).toBe(2);
		expect(parsed[1].password).toBe("****");
	});

	it("should handle arrays of objects with nested sensitive data", () => {
		const json = JSON.stringify([
			{ user: { name: "Alice", password: "secret1" } },
			{ user: { name: "Bob", creditCard: "9876-5432" } },
		]);
		const result = parseSensitiveData(json);
		const parsed = JSON.parse(result);
		expect(parsed[0].user.name).toBe("Alice");
		expect(parsed[0].user.password).toBe("****");
		expect(parsed[1].user.name).toBe("Bob");
		expect(parsed[1].user.creditCard).toBe("****");
	});

	it("should handle deeply nested structures", () => {
		const json = JSON.stringify({
			level1: {
				level2: {
					level3: {
						password: "deep-secret",
						data: "visible",
					},
				},
			},
		});
		const result = parseSensitiveData(json);
		const parsed = JSON.parse(result);
		expect(parsed.level1.level2.level3.password).toBe("****");
		expect(parsed.level1.level2.level3.data).toBe("visible");
	});

	it("should preserve non-sensitive values", () => {
		const json = JSON.stringify({
			username: "user",
			email: "user@example.com",
			age: 30,
			active: true,
			metadata: null,
		});
		const result = parseSensitiveData(json);
		expect(result).toBe(json);
	});

	it("should handle JSON strings within string values", () => {
		const json = JSON.stringify({
			data: JSON.stringify({ password: "nested-secret" }),
		});
		const result = parseSensitiveData(json);
		const parsed = JSON.parse(result);
		const nestedData = JSON.parse(parsed.data);
		expect(nestedData.password).toBe("****");
	});

	it("should return original string for invalid JSON", () => {
		const invalidJson = "invalid json string";
		const result = parseSensitiveData(invalidJson);
		expect(result).toBe(invalidJson);
	});

	it("should handle empty objects", () => {
		const json = JSON.stringify({});
		const result = parseSensitiveData(json);
		expect(result).toBe("{}");
	});

	it("should handle empty arrays", () => {
		const json = JSON.stringify([]);
		const result = parseSensitiveData(json);
		expect(result).toBe("[]");
	});

	it("should mask multiple occurrences of same sensitive key", () => {
		const json = JSON.stringify({
			user1: { password: "pass1" },
			user2: { password: "pass2" },
			admin: { password: "admin-pass" },
		});
		const result = parseSensitiveData(json);
		const parsed = JSON.parse(result);
		expect(parsed.user1.password).toBe("****");
		expect(parsed.user2.password).toBe("****");
		expect(parsed.admin.password).toBe("****");
	});

	it("should handle mixed data types in arrays", () => {
		const json = JSON.stringify([
			"string",
			123,
			{ password: "secret" },
			null,
			true,
		]);
		const result = parseSensitiveData(json);
		const parsed = JSON.parse(result);
		expect(parsed[0]).toBe("string");
		expect(parsed[1]).toBe(123);
		expect(parsed[2].password).toBe("****");
		expect(parsed[3]).toBe(null);
		expect(parsed[4]).toBe(true);
	});

	it("should not mask keys that are not in sensitiveKeys array", () => {
		const json = JSON.stringify({
			password: "secret",
			notSensitive: "visible",
		});
		const result = parseSensitiveData(json, ["password"]);
		const parsed = JSON.parse(result);
		expect(parsed.password).toBe("****");
		expect(parsed.notSensitive).toBe("visible");
	});

	it("should handle empty sensitiveKeys array", () => {
		const json = JSON.stringify({
			password: "secret",
			creditCard: "1234",
		});
		const result = parseSensitiveData(json, []);
		expect(result).toBe(json);
	});

	it("should mask sensitive keys regardless of case", () => {
		const json = JSON.stringify({
			password: "secret1",
			Password: "secret2",
			PASSWORD: "secret3",
			authorization: "token1",
			Authorization: "token2",
			AUTHORIZATION: "token3",
		});
		const result = parseSensitiveData(json, [
			"password",
			"authorization",
			"creditCard",
		]);
		const parsed = JSON.parse(result);
		expect(parsed.password).toBe("****");
		expect(parsed.Password).toBe("****");
		expect(parsed.PASSWORD).toBe("****");
		expect(parsed.authorization).toBe("****");
		expect(parsed.Authorization).toBe("****");
		expect(parsed.AUTHORIZATION).toBe("****");
	});

	it("should preserve original key casing while masking case-insensitively", () => {
		const json = JSON.stringify({
			Authorization: "Bearer abc123",
		});
		const result = parseSensitiveData(json, ["authorization"]);
		const parsed = JSON.parse(result);
		expect(Object.keys(parsed)).toEqual(["Authorization"]);
		expect(parsed.Authorization).toBe("****");
		expect(parsed.authorization).toBeUndefined();
	});

	it("should not mask non-sensitive keys with mixed casing", () => {
		const json = JSON.stringify({
			UserName: "john_doe",
			password: "secret",
		});
		const result = parseSensitiveData(json);
		const parsed = JSON.parse(result);
		expect(parsed.UserName).toBe("john_doe");
		expect(parsed.password).toBe("****");
	});
});
