import { describe, it, expect } from "vitest";
import { errorHandler } from "../errorHandler";

import { BadGateway } from "../../http/badResponses/badGateway";
import { BadRequest } from "../../http/badResponses/badRequest";
import { Conflict } from "../../http/badResponses/conflict";
import { Forbidden } from "../../http/badResponses/forbidden";
import { NotFound } from "../../http/badResponses/notFound";
import { NotImplemented } from "../../http/badResponses/notImplemented";
import { ServerError } from "../../http/badResponses/serverError";
import { Unauthorized } from "../../http/badResponses/unauthorized";
import { UnprocessableEntity } from "../../http/badResponses/unprocessableEntity";

import { Created } from "../../http/successResponses/created";
import { Found } from "../../http/successResponses/found";
import { NoContent } from "../../http/successResponses/noContent";
import { Success } from "../../http/successResponses/success";
import { Updated } from "../../http/successResponses/updated";

describe("errorHandler", () => {
  describe("native Response handling", () => {
    it("should return the same Response when error is a native Response", () => {
      const response = new Response("Test body", { status: 200 });

      const result = errorHandler(response);

      expect(result).toBe(response);
    });

    it("should preserve Response status code", () => {
      const response = new Response(null, { status: 418 });

      const result = errorHandler(response);

      expect(result.status).toBe(418);
    });
  });

  describe("success responses", () => {
    it("should handle Found response", () => {
      const found = new Found("Resource found", { id: 1 });

      const result = errorHandler(found);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(302);
    });

    it("should handle Created response", () => {
      const created = new Created("Resource created", { id: 1 });

      const result = errorHandler(created);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(201);
    });

    it("should handle Updated response", () => {
      const updated = new Updated("Resource updated", { id: 1 });

      const result = errorHandler(updated);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(200);
    });

    it("should handle Success response", () => {
      const success = new Success("Operation successful", { data: "test" });

      const result = errorHandler(success);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(200);
    });

    it("should handle NoContent response", () => {
      const noContent = new NoContent("");

      const result = errorHandler(noContent);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(204);
    });
  });

  describe("error responses", () => {
    it("should handle BadGateway error", () => {
      const error = new BadGateway("Bad gateway");

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(502);
    });

    it("should handle BadRequest error", () => {
      const error = new BadRequest("Invalid input");

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(400);
    });

    it("should handle Conflict error", () => {
      const error = new Conflict("Resource conflict");

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(409);
    });

    it("should handle Forbidden error", () => {
      const error = new Forbidden("Access forbidden");

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(403);
    });

    it("should handle NotFound error", () => {
      const error = new NotFound("Resource not found");

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(404);
    });

    it("should handle NotImplemented error", () => {
      const error = new NotImplemented("Not implemented");

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(501);
    });

    it("should handle ServerError", () => {
      const error = new ServerError("Internal error");

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(500);
    });

    it("should handle Unauthorized error", () => {
      const error = new Unauthorized("Not authorized");

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(401);
    });

    it("should handle UnprocessableEntity error", () => {
      const error = new UnprocessableEntity({});
      const result = errorHandler(error);
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(422);
    });
  });

  describe("unknown errors", () => {
    it("should return ServerError for unknown Error objects", () => {
      const error = new Error("Unknown error");

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(500);
    });

    it("should return ServerError for string errors", () => {
      const error = "Something went wrong";

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(500);
    });

    it("should return ServerError for null", () => {
      const result = errorHandler(null);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(500);
    });

    it("should return ServerError for undefined", () => {
      const result = errorHandler(undefined);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(500);
    });

    it("should return ServerError for plain objects", () => {
      const error = { message: "Plain object error" };

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(500);
    });

    it("should return ServerError for numbers", () => {
      const error = 404;

      const result = errorHandler(error);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(500);
    });
  });

  describe("response body content", () => {
    it("should include message in success response body", async () => {
      const success = new Success("Operation completed", { result: "ok" });

      const result = errorHandler(success);
      const body = await result.json();

      expect(result.statusText).toBe("Operation completed");
      expect(body).toEqual({ result: "ok" });
    });

    it("should include message in error response body", async () => {
      const error = new BadRequest("Invalid request");

      const result = errorHandler(error);
      const body = await result.json();

      expect(body.message).toBe("Invalid request");
    });

    it("should include Server error message for unknown errors", async () => {
      const error = new Error("Unexpected");

      const result = errorHandler(error);
      const body = await result.json();

      expect(body.message).toBe("Server error");
    });
  });
});
