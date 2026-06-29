import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Created } from "../../successResponses/created";

describe("Created", () => {
	let consoleLogSpy: any;

	beforeEach(() => {
		consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		process.env.NODE_ENV = "development";
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
		delete process.env.NODE_ENV;
	});

	describe("constructor", () => {
		it("should create instance with correct default values", () => {
			const response = new Created("Resource created");

			expect(response.name).toBe("Created");
			expect(response.status).toBe(201);
			expect(response.statusText).toBe("Resource created");
		});

		it("should set custom message", () => {
			const response = new Created("User created successfully");

			expect(response.statusText).toBe("User created successfully");
		});

		it("should set body when provided", () => {
			const body = { id: "123", name: "John Doe" };
			const response = new Created("User created", body);

			expect(response.body).toEqual(body);
		});

		it("should set body as undefined when not provided", () => {
			const response = new Created("Resource created");

			expect(response.body).toBeNull();
		});

		it("should handle complex body object", () => {
			const body = {
				user: {
					id: "user-123",
					email: "user@example.com",
					profile: {
						firstName: "John",
						lastName: "Doe",
					},
				},
				metadata: {
					createdAt: "2026-02-02T10:00:00Z",
				},
			};
			const response = new Created("User created", body);

			expect(response.body).toEqual(body);
		});

		it("should call onDebug on instantiation", () => {
			const _response = new Created("Resource created");

			expect(consoleLogSpy).toHaveBeenCalled();
		});

		it("should handle null body", () => {
			const response = new Created("Resource created", null);

			expect(response.body).toBeNull();
		});

		it("should handle empty object body", () => {
			const response = new Created("Resource created", {});

			expect(response.body).toEqual({});
		});

		it("should handle array as body", () => {
			const body = [
				{ id: 1, name: "Item 1" },
				{ id: 2, name: "Item 2" },
			];
			const response = new Created("Items created", body);

			expect(response.body).toEqual(body);
		});
	});

	describe("toResponse method", () => {
		it("should return Response object", () => {
			const response = new Created("Resource created");
			const httpResponse = response.toResponse();

			expect(httpResponse).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const response = new Created("Resource created");
			const httpResponse = response.toResponse();

			expect(httpResponse.status).toBe(201);
		});

		it("should have correct status text", () => {
			const response = new Created("User created successfully");
			const httpResponse = response.toResponse();

			expect(httpResponse.statusText).toBe("User created successfully");
		});

		it("should have correct Content-Type header", () => {
			const response = new Created("Resource created");
			const httpResponse = response.toResponse();

			expect(httpResponse.headers.get("Content-Type")).toBe("application/json");
		});

		it("should have correct JSON body", async () => {
			const body = { id: "123", name: "Test Resource" };
			const response = new Created("Resource created", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(responseBody).toEqual(body);
		});

		it("should handle undefined body", async () => {
			const response = new Created("Resource created");
			const httpResponse = response.toResponse();
			const text = await httpResponse.text();

			expect(text).toBe("null");
		});

		it("should return valid JSON string when body is provided", async () => {
			const body = { id: "123" };
			const response = new Created("Resource created", body);
			const httpResponse = response.toResponse();
			const text = await httpResponse.text();

			expect(() => JSON.parse(text)).not.toThrow();
		});

		it("should handle complex nested body", async () => {
			const body = {
				user: {
					id: "user-123",
					addresses: [
						{ type: "home", city: "New York" },
						{ type: "work", city: "Boston" },
					],
				},
			};
			const response = new Created("User created", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(responseBody).toEqual(body);
		});
	});

	describe("toJson method", () => {
		it("should return Response object", () => {
			const response = new Created("Resource created");
			const httpResponse = response.toJson();

			expect(httpResponse).toBeInstanceOf(Response);
		});

		it("should have correct status code", () => {
			const response = new Created("Resource created");
			const httpResponse = response.toJson();

			expect(httpResponse.status).toBe(201);
		});

		it("should have correct status text", () => {
			const response = new Created("User created successfully");
			const httpResponse = response.toJson();

			expect(httpResponse.statusText).toBe("User created successfully");
		});

		it("should have correct JSON body", async () => {
			const body = { id: "123", name: "Test Resource" };
			const response = new Created("Resource created", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(responseBody).toEqual(body);
		});

		it("should automatically set Content-Type to application/json", () => {
			const response = new Created("Resource created", { id: "123" });
			const httpResponse = response.toJson();

			expect(httpResponse.headers.get("Content-Type")).toContain(
				"application/json",
			);
		});

		it("should handle null body in response", async () => {
			const response = new Created("Resource created");
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(responseBody).toBeNull();
		});

		it("should handle array body", async () => {
			const body = [{ id: 1 }, { id: 2 }, { id: 3 }];
			const response = new Created("Resources created", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(responseBody).toEqual(body);
		});
	});

	describe("integration scenarios", () => {
		it("should handle user creation response", async () => {
			const body = {
				id: "user-abc-123",
				email: "newuser@example.com",
				username: "newuser",
				createdAt: "2026-02-02T10:00:00Z",
			};
			const response = new Created("User registered successfully", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(201);
			expect(responseBody.id).toBe("user-abc-123");
			expect(responseBody.email).toBe("newuser@example.com");
		});

		it("should handle post creation response", async () => {
			const body = {
				id: "post-123",
				title: "My First Post",
				content: "Hello, World!",
				author: {
					id: "user-456",
					name: "John Doe",
				},
				tags: ["introduction", "hello"],
				publishedAt: "2026-02-02T10:00:00Z",
			};
			const response = new Created("Post published successfully", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(201);
			expect(responseBody.title).toBe("My First Post");
			expect(responseBody.tags).toHaveLength(2);
		});

		it("should handle order creation response", async () => {
			const body = {
				orderId: "ORD-2026-001",
				items: [
					{ productId: "prod-1", quantity: 2, price: 29.99 },
					{ productId: "prod-2", quantity: 1, price: 49.99 },
				],
				total: 109.97,
				status: "pending",
				shippingAddress: {
					street: "123 Main St",
					city: "New York",
					zipCode: "10001",
				},
			};
			const response = new Created("Order placed successfully", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(201);
			expect(responseBody.orderId).toBe("ORD-2026-001");
			expect(responseBody.items).toHaveLength(2);
			expect(responseBody.total).toBe(109.97);
		});

		it("should handle file upload response", async () => {
			const body = {
				fileId: "file-xyz-789",
				filename: "document.pdf",
				size: 1024000,
				mimeType: "application/pdf",
				url: "https://cdn.example.com/files/document.pdf",
			};
			const response = new Created("File uploaded successfully", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(201);
			expect(responseBody.filename).toBe("document.pdf");
			expect(responseBody.url).toContain("cdn.example.com");
		});

		it("should handle bulk creation response", async () => {
			const body = {
				created: 5,
				failed: 0,
				items: [
					{ id: "item-1", status: "created" },
					{ id: "item-2", status: "created" },
					{ id: "item-3", status: "created" },
					{ id: "item-4", status: "created" },
					{ id: "item-5", status: "created" },
				],
			};
			const response = new Created("Bulk creation completed", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(httpResponse.status).toBe(201);
			expect(responseBody.created).toBe(5);
			expect(responseBody.items).toHaveLength(5);
		});
	});

	describe("comparison between toResponse and toJson", () => {
		it("should produce equivalent responses with body", async () => {
			const body = { id: "123", name: "Test" };
			const response = new Created("Resource created", body);
			const response1 = response.toResponse();
			const response2 = response.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
			expect(response1.status).toBe(response2.status);
			expect(response1.statusText).toBe(response2.statusText);
		});

		it("should produce equivalent responses with complex body", async () => {
			const body = {
				user: { id: 1, name: "John" },
				permissions: ["read", "write"],
			};
			const response = new Created("User created", body);
			const response1 = response.toResponse();
			const response2 = response.toJson();

			const body1 = await response1.json();
			const body2 = await response2.json();

			expect(body1).toEqual(body2);
		});

		it("should have consistent status codes", () => {
			const response = new Created("Resource created");
			const response1 = response.toResponse();
			const response2 = response.toJson();

			expect(response1.status).toBe(201);
			expect(response2.status).toBe(201);
		});

		it("should have consistent status text", () => {
			const response = new Created("Custom message");
			const response1 = response.toResponse();
			const response2 = response.toJson();

			expect(response1.statusText).toBe("Custom message");
			expect(response2.statusText).toBe("Custom message");
		});
	});

	describe("edge cases", () => {
		it("should handle empty message", () => {
			const response = new Created("");

			expect(response.statusText).toBe("");
			expect(response.status).toBe(201);
		});

		it("should handle very long message", () => {
			const longMessage = "A".repeat(1000);
			const response = new Created(longMessage);

			expect(response.statusText).toBe(longMessage);
		});

		it("should handle special characters in message", () => {
			const message = 'Created: {"id": "123"}';
			const response = new Created(message);

			expect(response.statusText).toBe(message);
		});

		it("should handle unicode characters in message", () => {
			const message = "Recurso criado: リソースが作成されました";
			const response = new Created(message);

			expect(response.statusText).toBe(message);
		});

		it("should handle deeply nested body object", () => {
			const body = {
				level1: {
					level2: {
						level3: {
							level4: {
								data: "deeply nested",
							},
						},
					},
				},
			};
			const response = new Created("Created", body);

			expect(response.body.level1.level2.level3.level4.data).toBe(
				"deeply nested",
			);
		});

		it("should handle body with Date object", async () => {
			const date = new Date("2026-02-02T10:00:00Z");
			const body = { createdAt: date.toISOString() };
			const response = new Created("Created", body);
			const httpResponse = response.toResponse();
			const responseBody = await httpResponse.json();

			expect(responseBody.createdAt).toBe("2026-02-02T10:00:00.000Z");
		});

		it("should handle body with boolean values", () => {
			const body = {
				isActive: true,
				isVerified: false,
			};
			const response = new Created("Created", body);

			expect(response.body.isActive).toBe(true);
			expect(response.body.isVerified).toBe(false);
		});

		it("should handle body with numeric values", () => {
			const body = {
				count: 42,
				price: 99.99,
				negative: -10,
			};
			const response = new Created("Created", body);

			expect(response.body.count).toBe(42);
			expect(response.body.price).toBe(99.99);
			expect(response.body.negative).toBe(-10);
		});

		it("should handle empty array as body", () => {
			const response = new Created("Created", []);
			expect(response.body).toEqual([]);
		});

		it("should handle string as body", () => {
			const response = new Created("Created", "Simple string body");

			expect(response.body).toBe("Simple string body");
		});

		it("should handle number as body", () => {
			const response = new Created("Created", 12345);

			expect(response.body).toBe(12345);
		});

		it("should handle boolean as body", () => {
			const response = new Created("Created", true);

			expect(response.body).toBe(true);
		});

		it("should handle large array as body", async () => {
			const body = Array.from({ length: 100 }, (_, i) => ({
				id: i + 1,
				name: `Item ${i + 1}`,
			}));
			const response = new Created("Bulk created", body);
			const httpResponse = response.toJson();
			const responseBody = await httpResponse.json();

			expect(responseBody).toHaveLength(100);
		});
	});
});
