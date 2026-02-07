import { describe, it, expect } from "vitest";
import { decodeRequestErrorMessage } from "../decodeRequestErrorMessage";

function createMockResponse(statusText: string): Response {
  return new Response(null, { statusText });
}

describe("decodeRequestErrorMessage", () => {
  describe("data.message extraction", () => {
    it("should return data.message when it is a string", () => {
      const data = { message: "Error occurred" };
      const response = createMockResponse("Internal Server Error");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Error occurred");
    });

    it("should prioritize data.message over other properties", () => {
      const data = {
        message: "Primary error",
        error: "Secondary error",
      };
      const response = createMockResponse("Status error");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Primary error");
    });

    it("should not return data.message if it is not a string", () => {
      const data = { message: 123 };
      const response = createMockResponse("Internal Server Error");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Internal Server Error");
    });
  });

  describe("data.error extraction", () => {
    it("should return data.error when it is a string", () => {
      const data = { error: "Something went wrong" };
      const response = createMockResponse("Internal Server Error");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Something went wrong");
    });

    it("should not return data.error if it is not a string", () => {
      const data = { error: { message: "Nested error" } };
      const response = createMockResponse("Internal Server Error");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Nested error");
    });

    it("should prioritize data.error over response.statusText", () => {
      const data = { error: "Data error" };
      const response = createMockResponse("Status error");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Data error");
    });
  });

  describe("data.error.message extraction", () => {
    it("should return data.error.message when it is a string", () => {
      const data = { error: { message: "Nested error message" } };
      const response = createMockResponse("Internal Server Error");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Nested error message");
    });

    it("should not return data.error.message if it is not a string", () => {
      const data = { error: { message: 404 } };
      const response = createMockResponse("Not Found");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Not Found");
    });

    it("should prioritize data.error.message over response.statusText", () => {
      const data = { error: { message: "Nested error" } };
      const response = createMockResponse("Status error");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Nested error");
    });
  });

  describe("response.statusText extraction", () => {
    it("should return response.statusText when data has no valid error", () => {
      const data = {};
      const response = createMockResponse("Bad Request");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Bad Request");
    });

    it("should return response.statusText when data is null", () => {
      const data = null;
      const response = createMockResponse("Unauthorized");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Unauthorized");
    });

    it("should return response.statusText when data is undefined", () => {
      const data = undefined;
      const response = createMockResponse("Forbidden");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Forbidden");
    });
  });

  describe("default message", () => {
    it("should return default message when no error found", () => {
      const data = {};
      const response = createMockResponse("");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Missing error message");
    });

    it("should return default message when data and response are empty", () => {
      const data = null;
      const response = new Response();

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Missing error message");
    });

    it("should return default message when all properties are non-string", () => {
      const data = {
        message: null,
        error: undefined,
      };
      const response = createMockResponse("");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Missing error message");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string in data.message", () => {
      const data = { message: "" };
      const response = createMockResponse("Fallback");

      const result = decodeRequestErrorMessage(data, response);
      // Empty string is still a valid string, so it should be returned
      expect(result).toBe("Fallback");
    });

    it("should handle data with nested objects", () => {
      const data = {
        error: {
          message: "Deep nested error",
          code: 500,
        },
      };
      const response = createMockResponse("Internal Server Error");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Deep nested error");
    });

    it("should handle data with array values", () => {
      const data = { message: ["error1", "error2"] };
      const response = createMockResponse("Fallback");

      const result = decodeRequestErrorMessage(data, response);

      expect(result).toBe("Fallback");
    });
  });
});
