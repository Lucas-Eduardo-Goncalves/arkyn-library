import { describe, expect, it } from "vitest";
import { z } from "zod";

import { formAsyncParse } from "../formAsyncParse";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  age: z.number().min(18, "Must be at least 18"),
});

describe("formAsyncParse", () => {
  describe("successful validation", () => {
    it("should return success true with parsed data for valid input", async () => {
      const formData = { name: "John", email: "john@example.com", age: 25 };

      const result = await formAsyncParse([formData, userSchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(formData);
      }
    });

    it("should return parsed data matching the schema type", async () => {
      const formData = { name: "Jane", email: "jane@example.com", age: 30 };

      const result = await formAsyncParse([formData, userSchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Jane");
        expect(result.data.email).toBe("jane@example.com");
        expect(result.data.age).toBe(30);
      }
    });

    it("should handle edge case values that meet constraints", async () => {
      const formData = { name: "A", email: "a@b.co", age: 18 };

      const result = await formAsyncParse([formData, userSchema]);

      expect(result.success).toBe(true);
    });

    it("should transform data according to schema", async () => {
      const transformSchema = z.object({
        name: z.string().trim(),
        value: z.coerce.number(),
      });
      const formData = { name: "  John  ", value: "42" };

      const result = await formAsyncParse([formData, transformSchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John");
        expect(result.data.value).toBe(42);
      }
    });

    it("should apply default values from schema", async () => {
      const defaultSchema = z.object({
        name: z.string(),
        role: z.string().default("user"),
      });
      const formData = { name: "John" };

      const result = await formAsyncParse([formData, defaultSchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe("user");
      }
    });
  });

  describe("failed validation", () => {
    it("should return success false for invalid input", async () => {
      const formData = { name: "", email: "invalid", age: 10 };

      const result = await formAsyncParse([formData, userSchema]);

      expect(result.success).toBe(false);
    });

    it("should return fieldErrors with error messages", async () => {
      const formData = { name: "", email: "invalid", age: 10 };

      const result = await formAsyncParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.name).toBe("Name is required");
        expect(result.fieldErrors.email).toBe("Invalid email");
        expect(result.fieldErrors.age).toBe("Must be at least 18");
      }
    });

    it("should return original fields on validation failure", async () => {
      const formData = { name: "", email: "invalid", age: 10 };

      const result = await formAsyncParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fields).toEqual(formData);
      }
    });

    it("should return single fieldError when only one field fails", async () => {
      const formData = { name: "", email: "john@example.com", age: 25 };

      const result = await formAsyncParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.name).toBe("Name is required");
        expect(result.fieldErrors.email).toBeUndefined();
        expect(result.fieldErrors.age).toBeUndefined();
      }
    });

    it("should handle missing required fields", async () => {
      const formData = { name: "John" };

      const result = await formAsyncParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.email).toBeDefined();
        expect(result.fieldErrors.age).toBeDefined();
      }
    });

    it("should handle wrong types", async () => {
      const formData = { name: 123, email: "john@example.com", age: "25" };

      const result = await formAsyncParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.name).toBeDefined();
        expect(result.fieldErrors.age).toBeDefined();
      }
    });
  });

  describe("async validation", () => {
    it("should handle async refine validation", async () => {
      const asyncSchema = z.object({
        email: z.string().refine(
          async (email) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return email.includes("@");
          },
          { message: "Invalid email format" },
        ),
      });

      const validResult = await formAsyncParse([
        { email: "test@example.com" },
        asyncSchema,
      ]);
      expect(validResult.success).toBe(true);

      const invalidResult = await formAsyncParse([
        { email: "invalid" },
        asyncSchema,
      ]);
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.fieldErrors.email).toBe("Invalid email format");
      }
    });

    it("should handle async transform", async () => {
      const asyncTransformSchema = z.object({
        value: z.string().transform(async (val) => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return val.toUpperCase();
        }),
      });

      const result = await formAsyncParse([
        { value: "hello" },
        asyncTransformSchema,
      ]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe("HELLO");
      }
    });

    it("should handle multiple async refinements", async () => {
      const multiAsyncSchema = z.object({
        username: z.string().refine(
          async (val) => {
            await new Promise((resolve) => setTimeout(resolve, 5));
            return val.length >= 3;
          },
          { message: "Username must be at least 3 characters" },
        ),
        email: z.string().refine(
          async (val) => {
            await new Promise((resolve) => setTimeout(resolve, 5));
            return val.includes("@");
          },
          { message: "Invalid email" },
        ),
      });

      const result = await formAsyncParse([
        { username: "ab", email: "invalid" },
        multiAsyncSchema,
      ]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.username).toBe(
          "Username must be at least 3 characters",
        );
        expect(result.fieldErrors.email).toBe("Invalid email");
      }
    });

    it("should handle async superRefine", async () => {
      const asyncSuperRefineSchema = z
        .object({
          password: z.string(),
          confirmPassword: z.string(),
        })
        .superRefine(async (data, ctx) => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          if (data.password !== data.confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Passwords don't match",
              path: ["confirmPassword"],
            });
          }
        });

      const invalidResult = await formAsyncParse([
        { password: "12345678", confirmPassword: "different" },
        asyncSuperRefineSchema,
      ]);

      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.fieldErrors.confirmPassword).toBe(
          "Passwords don't match",
        );
      }

      const validResult = await formAsyncParse([
        { password: "12345678", confirmPassword: "12345678" },
        asyncSuperRefineSchema,
      ]);

      expect(validResult.success).toBe(true);
    });

    it("should handle async validation with database-like check", async () => {
      const existingEmails = ["taken@example.com", "used@example.com"];

      const uniqueEmailSchema = z.object({
        email: z
          .string()
          .email()
          .refine(
            async (email) => {
              await new Promise((resolve) => setTimeout(resolve, 10));
              return !existingEmails.includes(email);
            },
            { message: "Email already exists" },
          ),
      });

      const takenResult = await formAsyncParse([
        { email: "taken@example.com" },
        uniqueEmailSchema,
      ]);

      expect(takenResult.success).toBe(false);
      if (!takenResult.success) {
        expect(takenResult.fieldErrors.email).toBe("Email already exists");
      }

      const availableResult = await formAsyncParse([
        { email: "available@example.com" },
        uniqueEmailSchema,
      ]);

      expect(availableResult.success).toBe(true);
    });
  });

  describe("nested object validation", () => {
    it("should handle nested object paths in fieldErrors", async () => {
      const nestedSchema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string().min(1, "Name is required"),
          }),
        }),
      });
      const formData = { user: { profile: { name: "" } } };

      const result = await formAsyncParse([formData, nestedSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors["user.profile.name"]).toBe(
          "Name is required",
        );
      }
    });

    it("should handle multiple nested errors", async () => {
      const nestedSchema = z.object({
        address: z.object({
          city: z.string().min(1, "City is required"),
          zip: z.string().min(5, "ZIP must be at least 5 characters"),
        }),
      });
      const formData = { address: { city: "", zip: "123" } };

      const result = await formAsyncParse([formData, nestedSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors["address.city"]).toBe("City is required");
        expect(result.fieldErrors["address.zip"]).toBe(
          "ZIP must be at least 5 characters",
        );
      }
    });

    it("should handle deeply nested objects", async () => {
      const deepSchema = z.object({
        level1: z.object({
          level2: z.object({
            level3: z.object({
              value: z.number().positive("Value must be positive"),
            }),
          }),
        }),
      });
      const formData = { level1: { level2: { level3: { value: -1 } } } };

      const result = await formAsyncParse([formData, deepSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors["level1.level2.level3.value"]).toBe(
          "Value must be positive",
        );
      }
    });
  });

  describe("array validation", () => {
    it("should handle array field errors with index paths", async () => {
      const arraySchema = z.object({
        items: z.array(z.string().min(1, "Item cannot be empty")),
      });
      const formData = { items: ["valid", "", "also valid"] };

      const result = await formAsyncParse([formData, arraySchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors["items.1"]).toBe("Item cannot be empty");
      }
    });

    it("should handle array of objects with errors", async () => {
      const arrayObjSchema = z.object({
        users: z.array(
          z.object({
            name: z.string().min(1, "Name is required"),
          }),
        ),
      });
      const formData = { users: [{ name: "John" }, { name: "" }] };

      const result = await formAsyncParse([formData, arrayObjSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors["users.1.name"]).toBe("Name is required");
      }
    });

    it("should validate array length constraints", async () => {
      const arrayLengthSchema = z.object({
        tags: z.array(z.string()).min(2, "At least 2 tags required"),
      });
      const formData = { tags: ["single"] };

      const result = await formAsyncParse([formData, arrayLengthSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.tags).toBe("At least 2 tags required");
      }
    });
  });

  describe("special schema types", () => {
    it("should handle optional fields", async () => {
      const optionalSchema = z.object({
        name: z.string(),
        nickname: z.string().optional(),
      });

      const result = await formAsyncParse([{ name: "John" }, optionalSchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nickname).toBeUndefined();
      }
    });

    it("should handle nullable fields", async () => {
      const nullableSchema = z.object({
        name: z.string(),
        middleName: z.string().nullable(),
      });

      const result = await formAsyncParse([
        { name: "John", middleName: null },
        nullableSchema,
      ]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.middleName).toBeNull();
      }
    });

    it("should handle union schemas", async () => {
      const unionSchema = z.object({
        id: z.union([z.string(), z.number()]),
      });

      expect((await formAsyncParse([{ id: "abc" }, unionSchema])).success).toBe(
        true,
      );
      expect((await formAsyncParse([{ id: 123 }, unionSchema])).success).toBe(
        true,
      );
      expect((await formAsyncParse([{ id: true }, unionSchema])).success).toBe(
        false,
      );
    });

    it("should handle enum schemas", async () => {
      const enumSchema = z.object({
        status: z.enum(["active", "inactive", "pending"]),
      });

      expect(
        (await formAsyncParse([{ status: "active" }, enumSchema])).success,
      ).toBe(true);
      expect(
        (await formAsyncParse([{ status: "unknown" }, enumSchema])).success,
      ).toBe(false);
    });

    it("should handle discriminated union schemas", async () => {
      const discriminatedSchema = z.discriminatedUnion("type", [
        z.object({ type: z.literal("email"), email: z.string().email() }),
        z.object({ type: z.literal("phone"), phone: z.string() }),
      ]);

      expect(
        (
          await formAsyncParse([
            { type: "email", email: "test@example.com" },
            discriminatedSchema,
          ])
        ).success,
      ).toBe(true);
      expect(
        (
          await formAsyncParse([
            { type: "phone", phone: "123456789" },
            discriminatedSchema,
          ])
        ).success,
      ).toBe(true);
      expect(
        (
          await formAsyncParse([
            { type: "email", email: "invalid" },
            discriminatedSchema,
          ])
        ).success,
      ).toBe(false);
    });

    it("should handle passthrough schema", async () => {
      const passthroughSchema = z
        .object({
          name: z.string(),
        })
        .passthrough();

      const result = await formAsyncParse([
        { name: "John", extra: "field" },
        passthroughSchema,
      ]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name: "John", extra: "field" });
      }
    });

    it("should handle strict schema rejecting extra fields", async () => {
      const strictSchema = z
        .object({
          name: z.string(),
        })
        .strict();

      const result = await formAsyncParse([
        { name: "John", extra: "field" },
        strictSchema,
      ]);

      expect(result.success).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle empty object schema", async () => {
      const emptySchema = z.object({});

      const result = await formAsyncParse([{}, emptySchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({});
      }
    });

    it("should handle empty formData with required fields", async () => {
      const result = await formAsyncParse([{}, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(Object.keys(result.fieldErrors).length).toBeGreaterThan(0);
      }
    });

    it("should preserve original formData in fields on error", async () => {
      const formData = {
        name: "",
        email: "invalid",
        age: 10,
        extraField: "should be preserved",
      };

      const result = await formAsyncParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fields).toBe(formData);
        expect(result.fields.extraField).toBe("should be preserved");
      }
    });

    it("should handle refinement validation", async () => {
      const refinedSchema = z
        .object({
          password: z.string().min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });

      const invalidResult = await formAsyncParse([
        { password: "12345678", confirmPassword: "different" },
        refinedSchema,
      ]);

      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.fieldErrors.confirmPassword).toBe(
          "Passwords don't match",
        );
      }

      const validResult = await formAsyncParse([
        { password: "12345678", confirmPassword: "12345678" },
        refinedSchema,
      ]);

      expect(validResult.success).toBe(true);
    });

    it("should return a promise", () => {
      const formData = { name: "John", email: "john@example.com", age: 25 };

      const result = formAsyncParse([formData, userSchema]);

      expect(result).toBeInstanceOf(Promise);
    });
  });
});
