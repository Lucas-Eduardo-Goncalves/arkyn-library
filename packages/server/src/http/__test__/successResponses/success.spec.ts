import { describe, expect, it } from "vitest";
import { Success } from "../../successResponses/success";

describe("Success", () => {
	describe("Constructor", () => {
		it("should create a Success instance with message and body", () => {
			const message = "Operation completed successfully";
			const body = { id: 1, name: "Test" };

			const success = new Success(message, body);

			expect(success.name).toBe("Success");
			expect(success.status).toBe(200);
			expect(success.statusText).toBe(message);
			expect(success.body).toEqual(body);
		});

		it("should create a Success instance with message only", () => {
			const message = "Operation completed";

			const success = new Success(message);

			expect(success.name).toBe("Success");
			expect(success.status).toBe(200);
			expect(success.statusText).toBe(message);
			expect(success.body).toBeNull();
		});

		it("should set body as undefined when body is null", () => {
			const message = "Test message";

			const success = new Success(message, null);

			expect(success.body).toBeNull();
		});

		it("should set body as undefined when body is undefined", () => {
			const message = "Test message";

			const success = new Success(message, undefined);

			expect(success.body).toBeNull();
		});
	});

	describe("toResponse", () => {
		it("should return a Response with correct status and headers", async () => {
			const message = "Success message";
			const body = { data: "test data" };

			const success = new Success(message, body);
			const response = success.toResponse();

			expect(response).toBeInstanceOf(Response);
			expect(response.status).toBe(200);
			expect(response.statusText).toBe(message);
			expect(response.headers.get("Content-Type")).toBe("application/json");

			const responseBody = await response.json();
			expect(responseBody).toEqual(body);
		});

		it("should return a Response with undefined body", async () => {
			const message = "Success without body";

			const success = new Success(message);
			const response = success.toResponse();

			expect(response).toBeInstanceOf(Response);
			expect(response.status).toBe(200);
			expect(response.statusText).toBe(message);

			const responseBody = await response.json();
			expect(responseBody).toBeNull();
		});

		it("should handle complex body objects", async () => {
			const message = "Complex data";
			const body = {
				users: [
					{ id: 1, name: "User 1" },
					{ id: 2, name: "User 2" },
				],
				metadata: {
					total: 2,
					page: 1,
				},
			};

			const success = new Success(message, body);
			const response = success.toResponse();

			const responseBody = await response.json();
			expect(responseBody).toEqual(body);
		});
	});

	describe("toJson", () => {
		it("should return a Response using Response.json with correct status", async () => {
			const message = "Success message";
			const body = { data: "test data" };

			const success = new Success(message, body);
			const response = success.toJson();

			expect(response).toBeInstanceOf(Response);
			expect(response.status).toBe(200);
			expect(response.statusText).toBe(message);

			const responseBody = await response.json();
			expect(responseBody).toEqual(body);
		});

		it("should return a Response with undefined body using toJson", async () => {
			const message = "Success without body";

			const success = new Success(message);
			const response = success.toJson();

			expect(response).toBeInstanceOf(Response);
			expect(response.status).toBe(200);

			const responseBody = await response.json();
			expect(responseBody).toBeNull();
		});

		it("should automatically set Content-Type header to application/json", () => {
			const message = "Test message";
			const body = { test: true };

			const success = new Success(message, body);
			const response = success.toJson();

			expect(response.headers.get("Content-Type")).toContain(
				"application/json",
			);
		});

		it("should handle arrays as body", async () => {
			const message = "Array response";
			const body = [1, 2, 3, 4, 5];

			const success = new Success(message, body);
			const response = success.toJson();

			const responseBody = await response.json();
			expect(responseBody).toEqual(body);
		});
	});

	describe("makeBody", () => {
		it("should return a structured body object with all properties", () => {
			const message = "Test message";
			const body = { data: "test" };

			const success = new Success(message, body);
			const structuredBody = success.makeBody();

			expect(structuredBody).toEqual({
				name: "Success",
				message: message,
				body: body,
			});
		});

		it("should handle undefined body in makeBody", () => {
			const message = "Test message";

			const success = new Success(message);
			const structuredBody = success.makeBody();

			expect(structuredBody).toEqual({
				name: "Success",
				message: message,
				body: null,
			});
		});
	});

	describe("Property setters and getters", () => {
		it("should allow updating body property", () => {
			const success = new Success("Initial message", { initial: true });

			success.body = { updated: true };

			expect(success.body).toEqual({ updated: true });
		});

		it("should allow updating statusText property", () => {
			const success = new Success("Initial message");

			success.statusText = "Updated message";

			expect(success.statusText).toBe("Updated message");
		});

		it("should allow updating status property", () => {
			const success = new Success("Test message");

			success.status = 201;

			expect(success.status).toBe(201);
		});

		it("should allow updating name property", () => {
			const success = new Success("Test message");

			success.name = "CustomSuccess";

			expect(success.name).toBe("CustomSuccess");
		});
	});
});
