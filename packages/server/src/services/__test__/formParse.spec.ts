import { describe, expect, it } from "vitest";
import { z } from "zod";
import { formParse } from "../formParse";

describe("formParse", () => {
  it("should return success and parsed data when validation passes", () => {
    const schema = z.object({
      name: z.string().min(1, "Name is required"),
      age: z.number().min(18, "Must be at least 18"),
    });

    const formData = { name: "John", age: 25 };

    const result = formParse([formData, schema]);

    expect(result.success).toBe(true);
    expect(result).toHaveProperty("data");
    if (result.success) expect(result.data).toEqual(formData);
  });

  it("should return field errors when validation fails", () => {
    const schema = z.object({
      name: z.string().min(1, "Name is required"),
      age: z.number().min(18, "Must be at least 18"),
    });

    const formData = { name: "", age: 17 };

    const result = formParse([formData, schema]);

    expect(result.success).toBe(false);
    expect(result).toHaveProperty("fieldErrors");

    if (!result.success) {
      expect(result.fieldErrors).toEqual({
        name: "Name is required",
        age: "Must be at least 18",
      });
      expect(result.fields).toEqual(formData);
    }
  });

  it("should handle missing fields gracefully", () => {
    const schema = z.object({
      name: z.string({ error: "Name is required" }).min(1, "Name is required"),
      age: z.number().min(18, "Must be at least 18"),
    });

    const formData = { age: 20 }; // Missing "name"

    const result = formParse([formData, schema]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors).toEqual({ name: "Name is required" });
      expect(result.fields).toEqual(formData);
    }
  });

  it("should return success for an empty schema", () => {
    const schema = z.object({});
    const formData = {};

    const result = formParse([formData, schema]);

    expect(result.success).toBe(true);
    expect(result).toHaveProperty("data");
    if (result.success) expect(result.data).toEqual(formData);
  });

  it("should handle nested schemas correctly", () => {
    const schema = z.object({
      user: z.object({
        name: z.string().min(1, "Name is required"),
        age: z.number().min(18, "Must be at least 18"),
      }),
    });

    const formData = {
      user: { name: "", age: 16 },
    };

    const result = formParse([formData, schema]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors).toEqual({
        "user.name": "Name is required",
        "user.age": "Must be at least 18",
      });
      expect(result.fields).toEqual(formData);
    }
  });
});
