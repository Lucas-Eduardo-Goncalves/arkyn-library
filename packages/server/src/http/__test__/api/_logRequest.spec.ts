import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LogService } from "../../../services/logService";
import { logRequest } from "../../api/_logRequest";

vi.mock("../../..", () => ({
	flushDebugLogs: vi.fn(),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const defaultConfig = {
	rawUrl: "https://example.com/api/data",
	status: 200,
	method: "GET" as const,
	token: "auth-token-123",
	elapsedTime: 150,
	requestHeaders: { Accept: "application/json" },
	requestBody: {},
	queryParams: { page: "1", limit: "10" },
	responseHeaders: { "Content-Type": "application/json" },
	responseBody: { data: "example response" },
};

describe("logRequest", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		LogService.resetConfig();
		mockFetch.mockResolvedValue({ ok: true });
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	describe("early return conditions", () => {
		it("should return early if LogService config is not set", async () => {
			await logRequest(defaultConfig);

			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("should return early in development environment", async () => {
			vi.stubEnv("NODE_ENV", "development");
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "user-token",
			});

			await logRequest(defaultConfig);

			expect(mockFetch).not.toHaveBeenCalled();
		});
	});

	describe("successful request", () => {
		beforeEach(() => {
			vi.stubEnv("NODE_ENV", "production");
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "user-token",
				logBaseApiUrl: "https://log-api.example.com",
			});
		});

		it("should send POST request to the log API", async () => {
			await logRequest(defaultConfig);

			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(mockFetch).toHaveBeenCalledWith(
				"https://log-api.example.com/ingest-log",
				expect.objectContaining({
					method: "POST",
				}),
			);
		});

		it("should include correct headers with authorization", async () => {
			await logRequest(defaultConfig);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer user-token",
					},
				}),
			);
		});

		it("should include correct body structure", async () => {
			await logRequest(defaultConfig);

			const [, fetchOptions] = mockFetch.mock.calls[0];
			const body = JSON.parse(fetchOptions.body);

			expect(body).toEqual({
				domainUrl: "https://example.com",
				pathnameUrl: "/api/data",
				trafficSourceId: "source-123",
				status: 200,
				protocol: "https",
				method: "get",
				trafficUserId: null,
				elapsedTime: 150,
				requestHeaders: JSON.stringify({ Accept: "application/json" }),
				requestBody: JSON.stringify({}),
				queryParams: JSON.stringify({ page: "1", limit: "10" }),
				responseHeaders: JSON.stringify({ "Content-Type": "application/json" }),
				responseBody: JSON.stringify({ data: "example response" }),
			});
		});

		it("should handle http protocol", async () => {
			const httpConfig = {
				...defaultConfig,
				rawUrl: "http://example.com/api/data",
			};

			await logRequest(httpConfig);

			const [, fetchOptions] = mockFetch.mock.calls[0];
			const body = JSON.parse(fetchOptions.body);

			expect(body.protocol).toBe("http");
			expect(body.domainUrl).toBe("http://example.com");
		});

		it("should handle different HTTP methods", async () => {
			const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

			for (const method of methods) {
				mockFetch.mockClear();
				await logRequest({ ...defaultConfig, method });

				const [, fetchOptions] = mockFetch.mock.calls[0];
				const body = JSON.parse(fetchOptions.body);

				expect(body.method).toBe(method.toLowerCase());
			}
		});

		it("should handle URLs with ports", async () => {
			const configWithPort = {
				...defaultConfig,
				rawUrl: "https://example.com:8080/api/data",
			};

			await logRequest(configWithPort);

			const [, fetchOptions] = mockFetch.mock.calls[0];
			const body = JSON.parse(fetchOptions.body);

			expect(body.domainUrl).toBe("https://example.com:8080");
			expect(body.pathnameUrl).toBe("/api/data");
		});

		it("should handle URLs with complex paths", async () => {
			const configWithComplexPath = {
				...defaultConfig,
				rawUrl: "https://example.com/api/v2/users/123/profile",
			};

			await logRequest(configWithComplexPath);

			const [, fetchOptions] = mockFetch.mock.calls[0];
			const body = JSON.parse(fetchOptions.body);

			expect(body.pathnameUrl).toBe("/api/v2/users/123/profile");
		});

		it("should handle different status codes", async () => {
			const statusCodes = [200, 201, 400, 401, 404, 500];

			for (const status of statusCodes) {
				mockFetch.mockClear();
				await logRequest({ ...defaultConfig, status });

				const [, fetchOptions] = mockFetch.mock.calls[0];
				const body = JSON.parse(fetchOptions.body);

				expect(body.status).toBe(status);
			}
		});

		it("should handle empty request body", async () => {
			const configWithEmptyBody = {
				...defaultConfig,
				requestBody: {},
			};

			await logRequest(configWithEmptyBody);

			const [, fetchOptions] = mockFetch.mock.calls[0];
			const body = JSON.parse(fetchOptions.body);

			expect(body.requestBody).toBe("{}");
		});

		it("should handle complex request body", async () => {
			const complexBody = {
				user: { name: "John", email: "john@example.com" },
				items: ["a", "b", "c"],
			};

			const configWithComplexBody = {
				...defaultConfig,
				requestBody: complexBody,
			};

			await logRequest(configWithComplexBody as any);

			const [, fetchOptions] = mockFetch.mock.calls[0];
			const body = JSON.parse(fetchOptions.body);

			expect(body.requestBody).toBe(JSON.stringify(complexBody));
		});

		it("should handle empty query params", async () => {
			const configWithEmptyParams = {
				...defaultConfig,
				queryParams: {},
			};

			await logRequest(configWithEmptyParams);

			const [, fetchOptions] = mockFetch.mock.calls[0];
			const body = JSON.parse(fetchOptions.body);

			expect(body.queryParams).toBe("{}");
		});

		it("should handle null token", async () => {
			const configWithNullToken = {
				...defaultConfig,
				token: null,
			};

			await logRequest(configWithNullToken);

			expect(mockFetch).toHaveBeenCalled();
		});
	});

	describe("error handling", () => {
		beforeEach(() => {
			vi.stubEnv("NODE_ENV", "production");
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "user-token",
				logBaseApiUrl: "https://log-api.example.com",
			});
		});

		it("should handle fetch errors gracefully", async () => {
			const { flushDebugLogs } = await import("../../..");
			mockFetch.mockRejectedValue(new Error("Network error"));

			await expect(logRequest(defaultConfig)).resolves.not.toThrow();

			expect(flushDebugLogs).toHaveBeenCalledWith({
				debugs: [expect.stringContaining("Error sending request:")],
				name: "LogError",
				scheme: "red",
			});
		});

		it("should include error message in debug logs", async () => {
			const { flushDebugLogs } = await import("../../..");
			const errorMessage = "Connection refused";
			mockFetch.mockRejectedValue(new Error(errorMessage));

			await logRequest(defaultConfig);

			expect(flushDebugLogs).toHaveBeenCalledWith({
				debugs: [expect.stringContaining(errorMessage)],
				name: "LogError",
				scheme: "red",
			});
		});

		it("should handle invalid URL gracefully", async () => {
			const { flushDebugLogs } = await import("../../..");
			const invalidConfig = {
				...defaultConfig,
				rawUrl: "invalid-url",
			};

			await expect(logRequest(invalidConfig)).resolves.not.toThrow();

			expect(flushDebugLogs).toHaveBeenCalledWith({
				debugs: [expect.stringContaining("Error sending request:")],
				name: "LogError",
				scheme: "red",
			});
		});
	});

	describe("environment handling", () => {
		it("should not send request in development mode", async () => {
			vi.stubEnv("NODE_ENV", "development");
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "user-token",
			});

			await logRequest(defaultConfig);

			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("should send request in production mode", async () => {
			vi.stubEnv("NODE_ENV", "production");
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "user-token",
				logBaseApiUrl: "https://log-api.example.com",
			});

			await logRequest(defaultConfig);

			expect(mockFetch).toHaveBeenCalled();
		});

		it("should send request in test mode", async () => {
			vi.stubEnv("NODE_ENV", "test");
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "user-token",
				logBaseApiUrl: "https://log-api.example.com",
			});

			await logRequest(defaultConfig);

			expect(mockFetch).toHaveBeenCalled();
		});
	});

	describe("LogService configuration", () => {
		beforeEach(() => {
			vi.stubEnv("NODE_ENV", "production");
		});

		it("should use trafficSourceId from LogService config", async () => {
			LogService.setConfig({
				trafficSourceId: "custom-source-id",
				userToken: "user-token",
				logBaseApiUrl: "https://log-api.example.com",
			});

			await logRequest(defaultConfig);

			const [, fetchOptions] = mockFetch.mock.calls[0];
			const body = JSON.parse(fetchOptions.body);

			expect(body.trafficSourceId).toBe("custom-source-id");
		});

		it("should use userToken for authorization header", async () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "custom-user-token",
				logBaseApiUrl: "https://log-api.example.com",
			});

			await logRequest(defaultConfig);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: "Bearer custom-user-token",
					}),
				}),
			);
		});

		it("should use apiUrl from LogService config", async () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "user-token",
				logBaseApiUrl: "https://custom-log-api.example.com",
			});

			await logRequest(defaultConfig);

			expect(mockFetch).toHaveBeenCalledWith(
				"https://custom-log-api.example.com/ingest-log",
				expect.any(Object),
			);
		});
	});
});
