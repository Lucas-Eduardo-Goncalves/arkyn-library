import { z } from "zod";
import { SchemaValidator } from "../schemaValidator";
import { flushDebugLogs } from "../flushDebugLogs";
import { ServerError } from "../../http/badResponses/serverError";
import { UnprocessableEntity } from "../../http/badResponses/unprocessableEntity";
import { describe, expect, it, vi } from "vitest";

vi.mock("../getCaller", () => ({
  getCaller: vi.fn(() => ({
    callerInfo: "mockedCallerInfo",
    functionName: "mockedFunctionName",
  })),
}));

vi.mock("../flushDebugLogs", () => ({
  flushDebugLogs: vi.fn(),
}));

describe("SchemaValidator", () => {
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    age: z.number().min(18, "Must be at least 18"),
  });

  const validator = new SchemaValidator(schema);

  describe("constructor", () => {
    it("should initialize with caller info and function name", () => {
      expect(validator.callerInfo).toBe("mockedCallerInfo");
      expect(validator.functionName).toBe("mockedFunctionName");
    });
  });

  describe("isValid", () => {
    it("should return true for valid data", () => {
      const data = { name: "John", age: 25 };
      expect(validator.isValid(data)).toBe(true);
    });

    it("should return false for invalid data", () => {
      const data = { name: "", age: 17 };
      expect(validator.isValid(data)).toBe(false);
    });
  });

  describe("safeValidate", () => {
    it("should return success for valid data", () => {
      const data = { name: "John", age: 25 };
      const result = validator.safeValidate(data);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });

    it("should return failure for invalid data", () => {
      const data = { name: "", age: 17 };
      const result = validator.safeValidate(data);
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues).toHaveLength(2);
    });
  });

  describe("validate", () => {
    it("should return parsed data for valid input", () => {
      const data = { name: "John", age: 25 };
      expect(validator.validate(data)).toEqual(data);
    });

    it("should throw ServerError for invalid input", () => {
      const data = { name: "", age: 17 };
      expect(() => validator.validate(data)).toThrow(ServerError);
    });
  });

  describe("formValidate", () => {
    it("should return parsed data for valid input", () => {
      const data = { name: "John", age: 25 };
      expect(validator.formValidate(data)).toEqual(data);
    });

    it("should throw UnprocessableEntity for invalid input", () => {
      const data = { name: "", age: 17 };
      expect(() => validator.formValidate(data)).toThrow(UnprocessableEntity);
    });

    it("should call httpDebug with formParsed data on validation failure", () => {
      const data = { name: "", age: 17 };

      try {
        validator.formValidate(data);
      } catch (error) {
        // Ignore the error
      }

      expect(flushDebugLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          scheme: "red",
          name: "ARKYN-BAD-RESPONSE-DEBUG",
          debugs: expect.arrayContaining([
            expect.stringContaining("UnprocessableEntity initialized"),
            expect.stringContaining("Caller Function: mockedFunctionName"),
            expect.stringContaining("Caller Location: mockedCallerInfo"),
            expect.stringContaining('"fieldErrors"'),
            expect.stringContaining('"name": "Name is required"'),
            expect.stringContaining('"age": "Must be at least 18"'),
          ]),
        })
      );
    });
  });
});
