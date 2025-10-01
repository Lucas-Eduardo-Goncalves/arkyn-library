import { beforeEach, describe, expect, it, vi } from "vitest";
import { ArkynLogService } from "../../services/arkynLogService";
import { arkynLogRequest } from "../arkynLogRequest";

vi.mock("../../services/arkynLogService");
vi.mock("../../services/httpDebug");

global.fetch = vi.fn() as any;

describe("arkynLogRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send a POST request with correct body and headers", async () => {
    const mockConfig = {
      rawUrl: "https://example.com/api/data",
      status: 200,
      method: "GET" as any,
      token: "auth-token-123",
      elapsedTime: 150,
      requestHeaders: {
        Accept: "application/json",
        Authorization: "Bearer token123",
      },
      requestBody: {},
      queryParams: { page: "1", limit: "10" },
      responseHeaders: { "Content-Type": "application/json" },
      responseBody: { data: "example response" },
    };

    const mockInboxConfig = {
      arkynTrafficSourceId: "channel-id",
      arkynUserToken: "user-token",
      arkynApiUrl: "https://api.example.com/arkyn",
    };

    (ArkynLogService.getArkynConfig as any).mockReturnValue(mockInboxConfig);

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    await arkynLogRequest(mockConfig);

    expect(fetch).toHaveBeenCalledWith(mockInboxConfig.arkynApiUrl, {
      method: "POST",
      body: JSON.stringify({
        domainUrl: "https://example.com",
        pathnameUrl: "/api/data",
        status: 200,
        protocol: "HTTPS",
        method: "GET",
        trafficUserId: null,
        elapsedTime: 150,
        requestHeaders: {
          Accept: "application/json",
          Authorization: "Bearer token123",
        },
        requestBody: {},
        queryParams: { page: "1", limit: "10" },
        responseHeaders: { "Content-Type": "application/json" },
        responseBody: { data: "example response" },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockInboxConfig.arkynUserToken}`,
      },
    });
  });

  it("should not send a request if arkyn configuration is not set", async () => {
    (ArkynLogService.getArkynConfig as any).mockReturnValue(undefined);

    await arkynLogRequest({
      status: 200,
      rawUrl: "https://example.com/api/data",
      method: "GET" as any,
      token: "auth-token-123",
      elapsedTime: 150,
      requestHeaders: {
        Accept: "application/json",
        Authorization: "Bearer token123",
      },
      requestBody: {},
      queryParams: { page: "1", limit: "10" },
      responseHeaders: { "Content-Type": "application/json" },
      responseBody: { data: "example response" },
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("should not send a request in development environment", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const mockConfig = {
      status: 200,
      rawUrl: "https://example.com/api/data",
      method: "POST" as any,
      token: "auth-token-123",
      elapsedTime: 150,
      requestHeaders: {
        Accept: "application/json",
        Authorization: "Bearer token123",
      },
      requestBody: {},
      queryParams: { page: "1", limit: "10" },
      responseHeaders: { "Content-Type": "application/json" },
      responseBody: { data: "example response" },
    };

    const mockInboxConfig = {
      arkynTrafficSourceId: "channel-id",
      arkynUserToken: "user-token",
      arkynApiUrl: "https://api.example.com/arkyn",
    };

    (ArkynLogService.getArkynConfig as any).mockReturnValue(mockInboxConfig);

    await arkynLogRequest(mockConfig);

    expect(fetch).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });
});
