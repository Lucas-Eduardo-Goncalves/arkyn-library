import { describe, expect, it, beforeEach, vi } from "vitest";

import { ApiService } from "../apiService";
import { getRequest } from "../../http/api/getRequest";
import { postRequest } from "../../http/api/postRequest";
import { putRequest } from "../../http/api/putRequest";
import { patchRequest } from "../../http/api/patchRequest";
import { deleteRequest } from "../../http/api/deleteRequest";
import { flushDebugLogs } from "../../utilities/flushDebugLogs";
import { string } from "zod";

vi.mock("../../http/api/getRequest", () => ({
  getRequest: vi.fn(),
}));

vi.mock("../../http/api/postRequest", () => ({
  postRequest: vi.fn(),
}));

vi.mock("../../http/api/putRequest", () => ({
  putRequest: vi.fn(),
}));

vi.mock("../../http/api/patchRequest", () => ({
  patchRequest: vi.fn(),
}));

vi.mock("../../http/api/deleteRequest", () => ({
  deleteRequest: vi.fn(),
}));

vi.mock("../../utilities/flushDebugLogs", () => ({
  flushDebugLogs: vi.fn(),
}));

describe("ApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create instance with baseUrl", () => {
      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      expect(api).toBeInstanceOf(ApiService);
    });

    it("should create instance with all options", () => {
      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseHeaders: { "X-Custom-Header": "value" },
        baseToken: "token123",
        enableDebug: true,
      });

      expect(api).toBeInstanceOf(ApiService);
    });

    it("should handle null baseToken", () => {
      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseToken: null,
      });

      expect(api).toBeInstanceOf(ApiService);
    });
  });

  describe("get method", () => {
    it("should call getRequest with correct URL", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: { data: "test" },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.get("/users");

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users",
        urlParams: {},
        headers: {},
      });
    });

    it("should return response from getRequest", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: { id: 1, name: "John" },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.get("/users/1");

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.response).toEqual({ id: 1, name: "John" });
    });

    it("should pass urlParams to getRequest", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.get("/users/:id", {
        urlParams: { id: "123" },
      });

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users/:id",
        urlParams: { id: "123" },
        headers: {},
      });
    });

    it("should pass custom headers to getRequest", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.get("/users", {
        headers: { "X-Request-Id": "req-123" },
      });

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users",
        urlParams: {},
        headers: { "X-Request-Id": "req-123" },
      });
    });

    it("should pass token as Authorization header", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.get("/users", {
        token: "user-token-123",
      });

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users",
        urlParams: {},
        headers: { Authorization: "Bearer user-token-123" },
      });
    });

    it("should merge baseHeaders with request headers", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseHeaders: { "X-Api-Key": "api-key-123" },
      });

      await api.get("/users", {
        headers: { "X-Request-Id": "req-123" },
      });

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users",
        urlParams: {},
        headers: {
          "X-Api-Key": "api-key-123",
          "X-Request-Id": "req-123",
        },
      });
    });

    it("should use baseToken for Authorization header", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseToken: "base-token-456",
      });

      await api.get("/users");

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users",
        urlParams: {},
        headers: { Authorization: "Bearer base-token-456" },
      });
    });

    it("should override baseToken with request token", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseToken: "base-token-456",
      });

      await api.get("/users", {
        token: "override-token-789",
      });

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users",
        urlParams: {},
        headers: { Authorization: "Bearer override-token-789" },
      });
    });

    it("should handle failed getRequest", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: false,
        status: 404,
        message: "Not Found",
        response: null,
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.get("/users/999");

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
    });
  });

  describe("post method", () => {
    it("should call postRequest with correct URL and body", async () => {
      vi.mocked(postRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Created",
        response: { id: 1 },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.post("/users", {
        body: { name: "John", email: "john@example.com" },
      });

      expect(postRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users",
        urlParams: {},
        headers: {},
        body: { name: "John", email: "john@example.com" },
      });
    });

    it("should return response from postRequest", async () => {
      vi.mocked(postRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Created",
        response: { id: 1, name: "John" },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.post("/users", {
        body: { name: "John" },
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.response).toEqual({ id: 1, name: "John" });
    });

    it("should pass urlParams to postRequest", async () => {
      vi.mocked(postRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Created",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.post("/organizations/:orgId/users", {
        urlParams: { orgId: "org-123" },
        body: { name: "John" },
      });

      expect(postRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/organizations/:orgId/users",
        urlParams: { orgId: "org-123" },
        headers: {},
        body: { name: "John" },
      });
    });

    it("should pass headers and token to postRequest", async () => {
      vi.mocked(postRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Created",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.post("/users", {
        headers: { "Content-Type": "application/json" },
        token: "user-token",
        body: { name: "John" },
      });

      expect(postRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users",
        urlParams: {},
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer user-token",
        },
        body: { name: "John" },
      });
    });

    it("should handle undefined body", async () => {
      vi.mocked(postRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Created",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.post("/trigger-action");

      expect(postRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/trigger-action",
        urlParams: {},
        headers: {},
        body: undefined,
      });
    });

    it("should handle failed postRequest", async () => {
      vi.mocked(postRequest).mockResolvedValue({
        success: false,
        status: 400,
        message: "Bad Request",
        response: { errors: ["Invalid email"] },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.post("/users", {
        body: { email: "invalid" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
    });
  });

  describe("put method", () => {
    it("should call putRequest with correct URL and body", async () => {
      vi.mocked(putRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Updated",
        response: { id: 1 },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.put("/users/1", {
        body: { name: "John Updated", email: "john@example.com" },
      });

      expect(putRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users/1",
        urlParams: {},
        headers: {},
        body: { name: "John Updated", email: "john@example.com" },
      });
    });

    it("should return response from putRequest", async () => {
      vi.mocked(putRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Updated",
        response: { id: 1, name: "John Updated" },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.put("/users/1", {
        body: { name: "John Updated" },
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.response).toEqual({ id: 1, name: "John Updated" });
    });

    it("should pass urlParams to putRequest", async () => {
      vi.mocked(putRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Updated",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.put("/users/:id", {
        urlParams: { id: "123" },
        body: { name: "Updated" },
      });

      expect(putRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users/:id",
        urlParams: { id: "123" },
        headers: {},
        body: { name: "Updated" },
      });
    });

    it("should merge all headers correctly", async () => {
      vi.mocked(putRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Updated",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseHeaders: { "X-Api-Key": "key-123" },
        baseToken: "base-token",
      });

      await api.put("/users/1", {
        headers: { "If-Match": '"etag"' },
        token: "override-token",
        body: { name: "Updated" },
      });

      expect(putRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users/1",
        urlParams: {},
        headers: {
          "X-Api-Key": "key-123",
          "If-Match": '"etag"',
          Authorization: "Bearer override-token",
        },
        body: { name: "Updated" },
      });
    });

    it("should handle failed putRequest", async () => {
      vi.mocked(putRequest).mockResolvedValue({
        success: false,
        status: 404,
        message: "Not Found",
        response: null,
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.put("/users/999", {
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
    });
  });

  describe("patch method", () => {
    it("should call patchRequest with correct URL and body", async () => {
      vi.mocked(patchRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Patched",
        response: { id: 1 },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.patch("/users/1", {
        body: { name: "Partial Update" },
      });

      expect(patchRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users/1",
        urlParams: {},
        headers: {},
        body: { name: "Partial Update" },
      });
    });

    it("should return response from patchRequest", async () => {
      vi.mocked(patchRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Patched",
        response: { id: 1, name: "Updated Name" },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.patch("/users/1", {
        body: { name: "Updated Name" },
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.response).toEqual({ id: 1, name: "Updated Name" });
    });

    it("should pass urlParams to patchRequest", async () => {
      vi.mocked(patchRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Patched",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.patch("/users/:id/settings", {
        urlParams: { id: "123" },
        body: { theme: "dark" },
      });

      expect(patchRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users/:id/settings",
        urlParams: { id: "123" },
        headers: {},
        body: { theme: "dark" },
      });
    });

    it("should handle failed patchRequest", async () => {
      vi.mocked(patchRequest).mockResolvedValue({
        success: false,
        status: 422,
        message: "Unprocessable Entity",
        response: { errors: { name: "too short" } },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.patch("/users/1", {
        body: { name: "a" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(422);
    });
  });

  describe("delete method", () => {
    it("should call deleteRequest with correct URL", async () => {
      vi.mocked(deleteRequest).mockResolvedValue({
        success: true,
        status: 204,
        message: "Deleted",
        response: null,
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.delete("/users/1");

      expect(deleteRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users/1",
        urlParams: {},
        headers: {},
        body: undefined,
      });
    });

    it("should return response from deleteRequest", async () => {
      vi.mocked(deleteRequest).mockResolvedValue({
        success: true,
        status: 204,
        message: "Deleted",
        response: null,
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.delete("/users/1");

      expect(result.success).toBe(true);
      expect(result.status).toBe(204);
    });

    it("should pass urlParams to deleteRequest", async () => {
      vi.mocked(deleteRequest).mockResolvedValue({
        success: true,
        status: 204,
        message: "Deleted",
        response: null,
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.delete("/users/:id", {
        urlParams: { id: "123" },
      });

      expect(deleteRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users/:id",
        urlParams: { id: "123" },
        headers: {},
        body: undefined,
      });
    });

    it("should pass body to deleteRequest when provided", async () => {
      vi.mocked(deleteRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Deleted",
        response: { deleted: 3 },
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.delete("/users/batch", {
        body: { ids: [1, 2, 3] },
      });

      expect(deleteRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users/batch",
        urlParams: {},
        headers: {},
        body: { ids: [1, 2, 3] },
      });
    });

    it("should pass headers and token to deleteRequest", async () => {
      vi.mocked(deleteRequest).mockResolvedValue({
        success: true,
        status: 204,
        message: "Deleted",
        response: null,
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseToken: "base-token",
      });

      await api.delete("/users/1", {
        headers: { "X-Reason": "test" },
      });

      expect(deleteRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users/1",
        urlParams: {},
        headers: {
          Authorization: "Bearer base-token",
          "X-Reason": "test",
        },
        body: undefined,
      });
    });

    it("should handle failed deleteRequest", async () => {
      vi.mocked(deleteRequest).mockResolvedValue({
        success: false,
        status: 403,
        message: "Forbidden",
        response: null,
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.delete("/admin/users/1");

      expect(result.success).toBe(false);
      expect(result.status).toBe(403);
    });
  });

  describe("header generation", () => {
    it("should generate headers with only baseToken", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseToken: "base-token-123",
      });

      await api.get("/test");

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/test",
        urlParams: {},
        headers: { Authorization: "Bearer base-token-123" },
      });
    });

    it("should generate headers with only baseHeaders", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseHeaders: {
          "X-Api-Key": "api-key",
          "X-Custom": "custom-value",
        },
      });

      await api.get("/test");

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/test",
        urlParams: {},
        headers: {
          "X-Api-Key": "api-key",
          "X-Custom": "custom-value",
        },
      });
    });

    it("should merge baseToken, baseHeaders, initHeaders, and token in correct order", async () => {
      vi.mocked(postRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseToken: "base-token",
        baseHeaders: { "X-Base-Header": "base-value" },
      });

      await api.post("/test", {
        headers: { "X-Request-Header": "request-value" },
        token: "request-token",
        body: {},
      });

      expect(postRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/test",
        urlParams: {},
        headers: {
          "X-Base-Header": "base-value",
          "X-Request-Header": "request-value",
          Authorization: "Bearer request-token",
        },
        body: {},
      });
    });

    it("should override same header from base with request header", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseHeaders: { "X-Override": "base-value" },
      });

      await api.get("/test", {
        headers: { "X-Override": "request-value" },
      });

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/test",
        urlParams: {},
        headers: { "X-Override": "request-value" },
      });
    });
  });

  describe("debug mode", () => {
    it("should not call flushDebugLogs when enableDebug is false", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        enableDebug: false,
      });

      await api.get("/test");

      expect(flushDebugLogs).not.toHaveBeenCalled();
    });

    it("should not call flushDebugLogs when enableDebug is undefined", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.get("/test");

      expect(flushDebugLogs).not.toHaveBeenCalled();
    });

    it("should call flushDebugLogs when enableDebug is true for get", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        enableDebug: true,
      });

      await api.get("/users");

      expect(flushDebugLogs).toHaveBeenCalledWith({
        debugs: expect.arrayContaining([
          "Base URL: https://api.example.com",
          "Endpoint: /users",
          "Status/Method: get => 200",
          "Message: Success",
          "Headers: {}",
        ]),
        name: "ApiDebug",
        scheme: "yellow",
      });
    });

    it("should call flushDebugLogs with headers for get", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        enableDebug: true,
      });

      await api.get("/users", {
        headers: { "X-Custom": "value" },
      });

      expect(flushDebugLogs).toHaveBeenCalledWith({
        debugs: expect.arrayContaining([
          "Base URL: https://api.example.com",
          "Endpoint: /users",
          "Status/Method: get => 200",
          "Message: Success",
          expect.stringContaining("Headers:"),
        ]),
        name: "ApiDebug",
        scheme: "yellow",
      });
    });

    it("should call flushDebugLogs with body for post", async () => {
      vi.mocked(postRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Created",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        enableDebug: true,
      });

      await api.post("/users", {
        body: { name: "John" },
      });

      expect(flushDebugLogs).toHaveBeenCalledWith({
        debugs: expect.arrayContaining([
          "Base URL: https://api.example.com",
          "Endpoint: /users",
          "Status/Method: post => 201",
          "Message: Created",
          expect.stringContaining("Headers:"),
          expect.stringContaining("Body:"),
        ]),
        name: "ApiDebug",
        scheme: "yellow",
      });
    });

    it("should call flushDebugLogs for put method", async () => {
      vi.mocked(putRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Updated",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        enableDebug: true,
      });

      await api.put("/users/1", {
        body: { name: "Updated" },
      });

      expect(flushDebugLogs).toHaveBeenCalledWith({
        debugs: expect.arrayContaining([
          "Base URL: https://api.example.com",
          "Endpoint: /users/1",
          "Status/Method: put => 200",
          "Message: Updated",
          "Headers: {}",
          expect.stringContaining("Body:"),
        ]),
        name: "ApiDebug",
        scheme: "yellow",
      });
    });

    it("should call flushDebugLogs for patch method", async () => {
      vi.mocked(patchRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Patched",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        enableDebug: true,
      });

      await api.patch("/users/1", {
        body: { name: "Patched" },
      });

      expect(flushDebugLogs).toHaveBeenCalledWith({
        debugs: expect.arrayContaining([
          "Base URL: https://api.example.com",
          "Endpoint: /users/1",
          "Status/Method: patch => 200",
          "Message: Patched",
          "Headers: {}",
          expect.stringContaining("Body:"),
        ]),
        name: "ApiDebug",
        scheme: "yellow",
      });
    });

    it("should call flushDebugLogs for delete method", async () => {
      vi.mocked(deleteRequest).mockResolvedValue({
        success: true,
        status: 204,
        message: "Deleted",
        response: null,
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        enableDebug: true,
      });

      await api.delete("/users/1");

      expect(flushDebugLogs).toHaveBeenCalledWith({
        debugs: expect.arrayContaining([
          "Base URL: https://api.example.com",
          "Endpoint: /users/1",
          "Status/Method: delete => 204",
          "Message: Deleted",
          "Headers: {}",
        ]),
        name: "ApiDebug",
        scheme: "yellow",
      });
    });
  });

  describe("common use cases", () => {
    it("should handle CRUD operations on a resource", async () => {
      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseToken: "auth-token",
      });

      vi.mocked(postRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Created",
        response: { id: 1, name: "Resource" },
        cause: null,
      });

      const createResult = await api.post("/resources", {
        body: { name: "Resource" },
      });
      expect(createResult.success).toBe(true);

      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: { id: 1, name: "Resource" },
        cause: null,
      });

      const readResult = await api.get("/resources/1");
      expect(readResult.success).toBe(true);

      vi.mocked(putRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Updated",
        response: { id: 1, name: "Updated Resource" },
        cause: null,
      });

      const updateResult = await api.put("/resources/1", {
        body: { id: 1, name: "Updated Resource" },
      });
      expect(updateResult.success).toBe(true);

      vi.mocked(deleteRequest).mockResolvedValue({
        success: true,
        status: 204,
        message: "Deleted",
        response: null,
        cause: null,
      });

      const deleteResult = await api.delete("/resources/1");
      expect(deleteResult.success).toBe(true);
    });

    it("should handle API with multiple instances for different services", async () => {
      const usersApi = new ApiService({
        baseUrl: "https://users.example.com",
        baseToken: "users-token",
      });

      const ordersApi = new ApiService({
        baseUrl: "https://orders.example.com",
        baseToken: "orders-token",
      });

      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: { id: 1 },
        cause: null,
      });

      await usersApi.get("/users/1");
      expect(getRequest).toHaveBeenCalledWith({
        url: "https://users.example.com/users/1",
        urlParams: {},
        headers: { Authorization: "Bearer users-token" },
      });

      await ordersApi.get("/orders/1");
      expect(getRequest).toHaveBeenCalledWith({
        url: "https://orders.example.com/orders/1",
        urlParams: {},
        headers: { Authorization: "Bearer orders-token" },
      });
    });

    it("should handle API with custom base headers for content negotiation", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
        baseHeaders: {
          Accept: "application/json",
          "Accept-Language": "en-US",
          "X-Api-Version": "v2",
        },
      });

      await api.get("/data");

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/data",
        urlParams: {},
        headers: {
          Accept: "application/json",
          "Accept-Language": "en-US",
          "X-Api-Version": "v2",
        },
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty endpoint", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      await api.get("");

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com",
        urlParams: {},
        headers: {},
      });
    });

    it("should handle baseUrl with trailing slash", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Success",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com/",
      });

      await api.get("/users");

      expect(getRequest).toHaveBeenCalledWith({
        url: "https://api.example.com//users",
        urlParams: {},
        headers: {},
      });
    });

    it("should handle complex nested body objects", async () => {
      vi.mocked(postRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Created",
        response: {},
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const complexBody = {
        user: {
          name: "John",
          addresses: [
            { type: "home", city: "NYC" },
            { type: "work", city: "LA" },
          ],
        },
        metadata: {
          tags: ["vip", "new"],
          preferences: { theme: "dark" },
        },
      };

      await api.post("/users", { body: complexBody });

      expect(postRequest).toHaveBeenCalledWith({
        url: "https://api.example.com/users",
        urlParams: {},
        headers: {},
        body: complexBody,
      });
    });

    it("should handle null response from request", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: true,
        status: 204,
        message: "No Content",
        response: null,
        cause: null,
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.get("/check");

      expect(result.response).toBeNull();
    });

    it("should handle error response with cause", async () => {
      vi.mocked(getRequest).mockResolvedValue({
        success: false,
        status: 500,
        message: "Internal Server Error",
        response: null,
        cause: "Connection timeout",
      });

      const api = new ApiService({
        baseUrl: "https://api.example.com",
      });

      const result = await api.get("/unstable");

      expect(result.success).toBe(false);
      expect(result.cause).toBe("Connection timeout");
    });
  });
});
