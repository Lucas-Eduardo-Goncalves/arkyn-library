import { describe, expect, it } from "vitest";
import { z } from "zod";

import { formParse } from "../formParse";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  age: z.number().min(18, "Must be at least 18"),
});

describe("formParse", () => {
  describe("successful validation", () => {
    it("should return success true with parsed data for valid input", () => {
      const formData = { name: "John", email: "john@example.com", age: 25 };

      const result = formParse([formData, userSchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(formData);
      }
    });

    it("should return parsed data matching the schema type", () => {
      const formData = { name: "Jane", email: "jane@example.com", age: 30 };

      const result = formParse([formData, userSchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Jane");
        expect(result.data.email).toBe("jane@example.com");
        expect(result.data.age).toBe(30);
      }
    });

    it("should handle edge case values that meet constraints", () => {
      const formData = { name: "A", email: "a@b.co", age: 18 };

      const result = formParse([formData, userSchema]);

      expect(result.success).toBe(true);
    });

    it("should transform data according to schema", () => {
      const transformSchema = z.object({
        name: z.string().trim(),
        value: z.coerce.number(),
      });
      const formData = { name: "  John  ", value: "42" };

      const result = formParse([formData, transformSchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John");
        expect(result.data.value).toBe(42);
      }
    });

    it("should apply default values from schema", () => {
      const defaultSchema = z.object({
        name: z.string(),
        role: z.string().default("user"),
      });
      const formData = { name: "John" };

      const result = formParse([formData, defaultSchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe("user");
      }
    });
  });

  describe("failed validation", () => {
    it("should return success false for invalid input", () => {
      const formData = { name: "", email: "invalid", age: 10 };

      const result = formParse([formData, userSchema]);

      expect(result.success).toBe(false);
    });

    it("should return fieldErrors with error messages", () => {
      const formData = { name: "", email: "invalid", age: 10 };

      const result = formParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.name).toBe("Name is required");
        expect(result.fieldErrors.email).toBe("Invalid email");
        expect(result.fieldErrors.age).toBe("Must be at least 18");
      }
    });

    it("should return original fields on validation failure", () => {
      const formData = { name: "", email: "invalid", age: 10 };

      const result = formParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fields).toEqual(formData);
      }
    });

    it("should return single fieldError when only one field fails", () => {
      const formData = { name: "", email: "john@example.com", age: 25 };

      const result = formParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.name).toBe("Name is required");
        expect(result.fieldErrors.email).toBeUndefined();
        expect(result.fieldErrors.age).toBeUndefined();
      }
    });

    it("should handle missing required fields", () => {
      const formData = { name: "John" };

      const result = formParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.email).toBeDefined();
        expect(result.fieldErrors.age).toBeDefined();
      }
    });

    it("should handle wrong types", () => {
      const formData = { name: 123, email: "john@example.com", age: "25" };

      const result = formParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.name).toBeDefined();
        expect(result.fieldErrors.age).toBeDefined();
      }
    });
  });

  describe("nested object validation", () => {
    it("should handle nested object paths in fieldErrors", () => {
      const nestedSchema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string().min(1, "Name is required"),
          }),
        }),
      });
      const formData = { user: { profile: { name: "" } } };

      const result = formParse([formData, nestedSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors["user.profile.name"]).toBe(
          "Name is required",
        );
      }
    });

    it("should handle multiple nested errors", () => {
      const nestedSchema = z.object({
        address: z.object({
          city: z.string().min(1, "City is required"),
          zip: z.string().min(5, "ZIP must be at least 5 characters"),
        }),
      });
      const formData = { address: { city: "", zip: "123" } };

      const result = formParse([formData, nestedSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors["address.city"]).toBe("City is required");
        expect(result.fieldErrors["address.zip"]).toBe(
          "ZIP must be at least 5 characters",
        );
      }
    });

    it("should handle deeply nested objects", () => {
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

      const result = formParse([formData, deepSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors["level1.level2.level3.value"]).toBe(
          "Value must be positive",
        );
      }
    });
  });

  describe("array validation", () => {
    it("should handle array field errors with index paths", () => {
      const arraySchema = z.object({
        items: z.array(z.string().min(1, "Item cannot be empty")),
      });
      const formData = { items: ["valid", "", "also valid"] };

      const result = formParse([formData, arraySchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors["items.1"]).toBe("Item cannot be empty");
      }
    });

    it("should handle array of objects with errors", () => {
      const arrayObjSchema = z.object({
        users: z.array(
          z.object({
            name: z.string().min(1, "Name is required"),
          }),
        ),
      });
      const formData = { users: [{ name: "John" }, { name: "" }] };

      const result = formParse([formData, arrayObjSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors["users.1.name"]).toBe("Name is required");
      }
    });

    it("should validate array length constraints", () => {
      const arrayLengthSchema = z.object({
        tags: z.array(z.string()).min(2, "At least 2 tags required"),
      });
      const formData = { tags: ["single"] };

      const result = formParse([formData, arrayLengthSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.tags).toBe("At least 2 tags required");
      }
    });
  });

  describe("special schema types", () => {
    it("should handle optional fields", () => {
      const optionalSchema = z.object({
        name: z.string(),
        nickname: z.string().optional(),
      });

      const result = formParse([{ name: "John" }, optionalSchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nickname).toBeUndefined();
      }
    });

    it("should handle nullable fields", () => {
      const nullableSchema = z.object({
        name: z.string(),
        middleName: z.string().nullable(),
      });

      const result = formParse([
        { name: "John", middleName: null },
        nullableSchema,
      ]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.middleName).toBeNull();
      }
    });

    it("should handle union schemas", () => {
      const unionSchema = z.object({
        id: z.union([z.string(), z.number()]),
      });

      expect(formParse([{ id: "abc" }, unionSchema]).success).toBe(true);
      expect(formParse([{ id: 123 }, unionSchema]).success).toBe(true);
      expect(formParse([{ id: true }, unionSchema]).success).toBe(false);
    });

    it("should handle enum schemas", () => {
      const enumSchema = z.object({
        status: z.enum(["active", "inactive", "pending"]),
      });

      expect(formParse([{ status: "active" }, enumSchema]).success).toBe(true);
      expect(formParse([{ status: "unknown" }, enumSchema]).success).toBe(
        false,
      );
    });

    it("should handle discriminated union schemas", () => {
      const discriminatedSchema = z.discriminatedUnion("type", [
        z.object({ type: z.literal("email"), email: z.string().email() }),
        z.object({ type: z.literal("phone"), phone: z.string() }),
      ]);

      expect(
        formParse([
          { type: "email", email: "test@example.com" },
          discriminatedSchema,
        ]).success,
      ).toBe(true);
      expect(
        formParse([{ type: "phone", phone: "123456789" }, discriminatedSchema])
          .success,
      ).toBe(true);
      expect(
        formParse([{ type: "email", email: "invalid" }, discriminatedSchema])
          .success,
      ).toBe(false);
    });

    it("should handle passthrough schema", () => {
      const passthroughSchema = z
        .object({
          name: z.string(),
        })
        .passthrough();

      const result = formParse([
        { name: "John", extra: "field" },
        passthroughSchema,
      ]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name: "John", extra: "field" });
      }
    });

    it("should handle strict schema rejecting extra fields", () => {
      const strictSchema = z
        .object({
          name: z.string(),
        })
        .strict();

      const result = formParse([
        { name: "John", extra: "field" },
        strictSchema,
      ]);

      expect(result.success).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle empty object schema", () => {
      const emptySchema = z.object({});

      const result = formParse([{}, emptySchema]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({});
      }
    });

    it("should handle empty formData with required fields", () => {
      const result = formParse([{}, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(Object.keys(result.fieldErrors).length).toBeGreaterThan(0);
      }
    });

    it("should preserve original formData in fields on error", () => {
      const formData = {
        name: "",
        email: "invalid",
        age: 10,
        extraField: "should be preserved",
      };

      const result = formParse([formData, userSchema]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fields).toBe(formData);
        expect(result.fields.extraField).toBe("should be preserved");
      }
    });

    it("should handle refinement validation", () => {
      const refinedSchema = z
        .object({
          password: z.string().min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });

      const invalidResult = formParse([
        { password: "12345678", confirmPassword: "different" },
        refinedSchema,
      ]);

      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.fieldErrors.confirmPassword).toBe(
          "Passwords don't match",
        );
      }

      const validResult = formParse([
        { password: "12345678", confirmPassword: "12345678" },
        refinedSchema,
      ]);

      expect(validResult.success).toBe(true);
    });

    it("should handle superRefine validation", () => {
      const superRefinedSchema = z
        .object({
          startDate: z.string(),
          endDate: z.string(),
        })
        .superRefine((data, ctx) => {
          if (data.endDate < data.startDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "End date must be after start date",
              path: ["endDate"],
            });
          }
        });

      const result = formParse([
        { startDate: "2026-02-05", endDate: "2026-02-01" },
        superRefinedSchema,
      ]);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors.endDate).toBe(
          "End date must be after start date",
        );
      }
    });
  });
});
