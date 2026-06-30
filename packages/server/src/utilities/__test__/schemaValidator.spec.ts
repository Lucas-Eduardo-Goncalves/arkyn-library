import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ServerError } from "../../http/badResponses/serverError";
import { UnprocessableEntity } from "../../http/badResponses/unprocessableEntity";
import { SchemaValidator } from "../schemaValidator";

const userSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.email("Invalid email"),
	age: z.number().min(18, "Must be at least 18"),
});

const asyncSchema = z.object({
	username: z.string().min(3, "Username must be at least 3 characters"),
	email: z.email("Invalid email"),
});

describe("SchemaValidator", () => {
	describe("constructor", () => {
		it("should create instance with the provided schema", () => {
			const validator = new SchemaValidator(userSchema);

			expect(validator.schema).toBe(userSchema);
		});

		it("should accept different schema types", () => {
			const stringSchema = z.string();
			const numberSchema = z.number();
			const arraySchema = z.array(z.string());

			const stringValidator = new SchemaValidator(stringSchema);
			const numberValidator = new SchemaValidator(numberSchema);
			const arrayValidator = new SchemaValidator(arraySchema);

			expect(stringValidator.schema).toBe(stringSchema);
			expect(numberValidator.schema).toBe(numberSchema);
			expect(arrayValidator.schema).toBe(arraySchema);
		});
	});

	describe("isValid", () => {
		it("should return true for valid data", () => {
			const validator = new SchemaValidator(userSchema);
			const validData = { name: "John", email: "john@example.com", age: 25 };

			expect(validator.isValid(validData)).toBe(true);
		});

		it("should return false for invalid data", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "invalid-email", age: 15 };

			expect(validator.isValid(invalidData)).toBe(false);
		});

		it("should return false for missing required fields", () => {
			const validator = new SchemaValidator(userSchema);
			const incompleteData = { name: "John" };

			expect(validator.isValid(incompleteData)).toBe(false);
		});

		it("should return false for wrong types", () => {
			const validator = new SchemaValidator(userSchema);
			const wrongTypeData = { name: 123, email: "john@example.com", age: "25" };

			expect(validator.isValid(wrongTypeData)).toBe(false);
		});

		it("should return true for data meeting minimum constraints", () => {
			const validator = new SchemaValidator(userSchema);
			const edgeCaseData = { name: "A", email: "a@b.co", age: 18 };

			expect(validator.isValid(edgeCaseData)).toBe(true);
		});
	});

	describe("safeValidate", () => {
		it("should return success true with data for valid input", () => {
			const validator = new SchemaValidator(userSchema);
			const validData = { name: "John", email: "john@example.com", age: 25 };

			const result = validator.safeValidate(validData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validData);
			}
		});

		it("should return success false with error for invalid input", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "invalid", age: 10 };

			const result = validator.safeValidate(invalidData);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBeDefined();
				expect(result.error.issues.length).toBeGreaterThan(0);
			}
		});

		it("should return all validation errors in issues array", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "invalid", age: 10 };

			const result = validator.safeValidate(invalidData);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBe(3);
			}
		});

		it("should return correct error paths", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "john@example.com", age: 25 };

			const result = validator.safeValidate(invalidData);

			expect(result.success).toBe(false);
			if (!result.success) {
				const paths = result.error.issues.map((issue) => issue.path[0]);
				expect(paths).toContain("name");
			}
		});

		it("should transform data according to schema", () => {
			const transformSchema = z.object({
				name: z.string().trim(),
				value: z.coerce.number(),
			});
			const validator = new SchemaValidator(transformSchema);
			const data = { name: "  John  ", value: "42" };

			const result = validator.safeValidate(data);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("John");
				expect(result.data.value).toBe(42);
			}
		});
	});

	describe("validate", () => {
		it("should return parsed data for valid input", () => {
			const validator = new SchemaValidator(userSchema);
			const validData = { name: "John", email: "john@example.com", age: 25 };

			const result = validator.validate(validData);

			expect(result).toEqual(validData);
		});

		it("should throw ServerError for invalid input", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "invalid", age: 10 };

			expect(() => validator.validate(invalidData)).toThrow(ServerError);
		});

		it("should throw ServerError with formatted message", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "john@example.com", age: 25 };

			try {
				validator.validate(invalidData);
				expect.fail("Should have thrown ServerError");
			} catch (error) {
				expect(error).toBeInstanceOf(ServerError);
				expect((error as ServerError).statusText).toContain(
					"Error validating:",
				);
				expect((error as ServerError).statusText).toContain("name");
			}
		});

		it("should include all error paths in the message", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "invalid", age: 10 };

			try {
				validator.validate(invalidData);
				expect.fail("Should have thrown ServerError");
			} catch (error) {
				expect(error).toBeInstanceOf(ServerError);
				const message = (error as ServerError).statusText;
				expect(message).toContain("name");
				expect(message).toContain("email");
				expect(message).toContain("age");
			}
		});

		it("should include error messages in the formatted output", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "john@example.com", age: 25 };

			try {
				validator.validate(invalidData);
				expect.fail("Should have thrown ServerError");
			} catch (error) {
				expect((error as ServerError).statusText).toContain("Name is required");
			}
		});

		it("should have status 500 on ServerError", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "john@example.com", age: 25 };

			try {
				validator.validate(invalidData);
				expect.fail("Should have thrown ServerError");
			} catch (error) {
				expect((error as ServerError).status).toBe(500);
			}
		});

		it("should handle nested object validation errors", () => {
			const nestedSchema = z.object({
				user: z.object({
					profile: z.object({
						name: z.string().min(1, "Name is required"),
					}),
				}),
			});
			const validator = new SchemaValidator(nestedSchema);
			const invalidData = { user: { profile: { name: "" } } };

			try {
				validator.validate(invalidData);
				expect.fail("Should have thrown ServerError");
			} catch (error) {
				expect((error as ServerError).statusText).toContain(
					"user.profile.name",
				);
			}
		});
	});

	describe("formValidate", () => {
		it("should return parsed data for valid input", () => {
			const validator = new SchemaValidator(userSchema);
			const validData = { name: "John", email: "john@example.com", age: 25 };

			const result = validator.formValidate(validData);

			expect(result).toEqual(validData);
		});

		it("should throw UnprocessableEntity for invalid input", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "invalid", age: 10 };

			expect(() => validator.formValidate(invalidData)).toThrow(
				UnprocessableEntity,
			);
		});

		it("should include fieldErrors in UnprocessableEntity", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "invalid", age: 10 };

			try {
				validator.formValidate(invalidData);
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntity);
				const cause = (error as UnprocessableEntity).cause;
				expect(cause.fieldErrors).toBeDefined();
				expect(cause.fieldErrors.name).toBe("Name is required");
				expect(cause.fieldErrors.email).toBe("Invalid email");
				expect(cause.fieldErrors.age).toBe("Must be at least 18");
			}
		});

		it("should include fields in UnprocessableEntity", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "John", email: "invalid", age: 10 };

			try {
				validator.formValidate(invalidData);
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				const cause = (error as UnprocessableEntity).cause;
				expect(cause.fields).toEqual(invalidData);
			}
		});

		it("should include scrollTo pointing to first error field", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "invalid", age: 10 };

			try {
				validator.formValidate(invalidData);
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				const cause = (error as UnprocessableEntity).cause;
				expect(cause.data.scrollTo).toBe("name");
			}
		});

		it("should use custom message when provided", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "john@example.com", age: 25 };

			try {
				validator.formValidate(invalidData, "Custom validation error");
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				expect((error as UnprocessableEntity).statusText).toBe(
					"Custom validation error",
				);
			}
		});

		it("should have status 422 on UnprocessableEntity", () => {
			const validator = new SchemaValidator(userSchema);
			const invalidData = { name: "", email: "john@example.com", age: 25 };

			try {
				validator.formValidate(invalidData);
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				expect((error as UnprocessableEntity).status).toBe(422);
			}
		});

		it("should handle nested field paths in fieldErrors", () => {
			const nestedSchema = z.object({
				address: z.object({
					city: z.string().min(1, "City is required"),
				}),
			});
			const validator = new SchemaValidator(nestedSchema);
			const invalidData = { address: { city: "" } };

			try {
				validator.formValidate(invalidData);
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				const cause = (error as UnprocessableEntity).cause;
				expect(cause.fieldErrors["address.city"]).toBe("City is required");
			}
		});
	});

	describe("formAsyncValidate", () => {
		it("should return parsed data for valid input", async () => {
			const validator = new SchemaValidator(asyncSchema);
			const validData = { username: "john_doe", email: "john@example.com" };

			const result = await validator.formAsyncValidate(validData);

			expect(result).toEqual(validData);
		});

		it("should throw UnprocessableEntity for invalid input", async () => {
			const validator = new SchemaValidator(asyncSchema);
			const invalidData = { username: "jo", email: "invalid" };

			await expect(validator.formAsyncValidate(invalidData)).rejects.toThrow(
				UnprocessableEntity,
			);
		});

		it("should include fieldErrors in UnprocessableEntity", async () => {
			const validator = new SchemaValidator(asyncSchema);
			const invalidData = { username: "jo", email: "invalid" };

			try {
				await validator.formAsyncValidate(invalidData);
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntity);
				const cause = (error as UnprocessableEntity).cause;
				expect(cause.fieldErrors).toBeDefined();
				expect(cause.fieldErrors.username).toBe(
					"Username must be at least 3 characters",
				);
				expect(cause.fieldErrors.email).toBe("Invalid email");
			}
		});

		it("should include fields in UnprocessableEntity", async () => {
			const validator = new SchemaValidator(asyncSchema);
			const invalidData = { username: "jo", email: "invalid" };

			try {
				await validator.formAsyncValidate(invalidData);
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				const cause = (error as UnprocessableEntity).cause;
				expect(cause.fields).toEqual(invalidData);
			}
		});

		it("should include scrollTo pointing to first error field", async () => {
			const validator = new SchemaValidator(asyncSchema);
			const invalidData = { username: "jo", email: "invalid" };

			try {
				await validator.formAsyncValidate(invalidData);
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				const cause = (error as UnprocessableEntity).cause;
				expect(cause.data.scrollTo).toBe("username");
			}
		});

		it("should use custom message when provided", async () => {
			const validator = new SchemaValidator(asyncSchema);
			const invalidData = { username: "jo", email: "john@example.com" };

			try {
				await validator.formAsyncValidate(
					invalidData,
					"Async validation error",
				);
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				expect((error as UnprocessableEntity).statusText).toBe(
					"Async validation error",
				);
			}
		});

		it("should have status 422 on UnprocessableEntity", async () => {
			const validator = new SchemaValidator(asyncSchema);
			const invalidData = { username: "jo", email: "john@example.com" };

			try {
				await validator.formAsyncValidate(invalidData);
				expect.fail("Should have thrown UnprocessableEntity");
			} catch (error) {
				expect((error as UnprocessableEntity).status).toBe(422);
			}
		});

		it("should work with async refinements", async () => {
			const asyncRefinementSchema = z.object({
				email: z.string().refine(
					async (email) => {
						await new Promise((resolve) => setTimeout(resolve, 10));
						return email.includes("@");
					},
					{ message: "Invalid email format" },
				),
			});
			const validator = new SchemaValidator(asyncRefinementSchema);

			const validResult = await validator.formAsyncValidate({
				email: "test@example.com",
			});
			expect(validResult.email).toBe("test@example.com");

			await expect(
				validator.formAsyncValidate({ email: "invalid" }),
			).rejects.toThrow(UnprocessableEntity);
		});
	});

	describe("edge cases", () => {
		it("should handle empty object schema", () => {
			const emptySchema = z.object({});
			const validator = new SchemaValidator(emptySchema);

			expect(validator.isValid({})).toBe(true);
			expect(validator.validate({})).toEqual({});
		});

		it("should handle optional fields", () => {
			const optionalSchema = z.object({
				name: z.string(),
				nickname: z.string().optional(),
			});
			const validator = new SchemaValidator(optionalSchema);

			expect(validator.isValid({ name: "John" })).toBe(true);
			expect(validator.isValid({ name: "John", nickname: "Johnny" })).toBe(
				true,
			);
		});

		it("should handle nullable fields", () => {
			const nullableSchema = z.object({
				name: z.string(),
				middleName: z.string().nullable(),
			});
			const validator = new SchemaValidator(nullableSchema);

			expect(validator.isValid({ name: "John", middleName: null })).toBe(true);
			expect(validator.isValid({ name: "John", middleName: "Paul" })).toBe(
				true,
			);
		});

		it("should handle default values", () => {
			const defaultSchema = z.object({
				name: z.string(),
				role: z.string().default("user"),
			});
			const validator = new SchemaValidator(defaultSchema);

			const result = validator.validate({ name: "John" });
			expect(result.role).toBe("user");
		});

		it("should handle array schemas", () => {
			const arraySchema = z.object({
				tags: z.array(z.string().min(1, "Tag cannot be empty")),
			});
			const validator = new SchemaValidator(arraySchema);

			expect(validator.isValid({ tags: ["a", "b"] })).toBe(true);
			expect(validator.isValid({ tags: [""] })).toBe(false);
		});

		it("should handle union schemas", () => {
			const unionSchema = z.object({
				id: z.union([z.string(), z.number()]),
			});
			const validator = new SchemaValidator(unionSchema);

			expect(validator.isValid({ id: "abc" })).toBe(true);
			expect(validator.isValid({ id: 123 })).toBe(true);
			expect(validator.isValid({ id: true })).toBe(false);
		});

		it("should handle discriminated union schemas", () => {
			const discriminatedSchema = z.discriminatedUnion("type", [
				z.object({ type: z.literal("email"), email: z.string().email() }),
				z.object({ type: z.literal("phone"), phone: z.string() }),
			]);
			const validator = new SchemaValidator(discriminatedSchema);

			expect(
				validator.isValid({ type: "email", email: "test@example.com" }),
			).toBe(true);
			expect(validator.isValid({ type: "phone", phone: "123456789" })).toBe(
				true,
			);
			expect(validator.isValid({ type: "email", email: "invalid" })).toBe(
				false,
			);
		});

		it("should handle enum schemas", () => {
			const enumSchema = z.object({
				status: z.enum(["active", "inactive", "pending"]),
			});
			const validator = new SchemaValidator(enumSchema);

			expect(validator.isValid({ status: "active" })).toBe(true);
			expect(validator.isValid({ status: "unknown" })).toBe(false);
		});

		it("should handle passthrough schema", () => {
			const passthroughSchema = z
				.object({
					name: z.string(),
				})
				.passthrough();
			const validator = new SchemaValidator(passthroughSchema);

			const result = validator.validate({ name: "John", extra: "field" });
			expect(result).toEqual({ name: "John", extra: "field" });
		});

		it("should handle strict schema", () => {
			const strictSchema = z
				.object({
					name: z.string(),
				})
				.strict();
			const validator = new SchemaValidator(strictSchema);

			expect(validator.isValid({ name: "John" })).toBe(true);
			expect(validator.isValid({ name: "John", extra: "field" })).toBe(false);
		});
	});
});
