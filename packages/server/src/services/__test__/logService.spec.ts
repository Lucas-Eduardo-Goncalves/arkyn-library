import { beforeEach, describe, expect, it, vi } from "vitest";

import { flushDebugLogs } from "../../utilities/flushDebugLogs";
import { LogService } from "../logService";

vi.mock("../../utilities/flushDebugLogs", () => ({
	flushDebugLogs: vi.fn(),
}));

describe("LogService", () => {
	beforeEach(() => {
		LogService.resetConfig();
		vi.clearAllMocks();
	});

	describe("setConfig", () => {
		it("should set configuration successfully", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
			});

			const config = LogService.getConfig();

			expect(config).toBeDefined();
			expect(config?.trafficSourceId).toBe("source-123");
			expect(config?.serviceToken).toBe("token-456");
		});

		it("should not configure a fallback apiUrl when logBaseApiUrl is not provided", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBeNull();
		});

		it("should reject an insecure http endpoint that is not localhost", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "http://62.238.8.44:8081",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBeNull();
		});

		it("should reject an invalid logBaseApiUrl", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "not-a-valid-url",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBeNull();
		});

		it("should accept an insecure http endpoint for localhost", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "http://localhost:4000",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("http://localhost:4000/ingest-log");
		});

		it("should accept an insecure http endpoint for 127.0.0.1", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "http://127.0.0.1:4000",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("http://127.0.0.1:4000/ingest-log");
		});

		it("should use custom logBaseApiUrl when provided", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "https://custom-log-server.com",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("https://custom-log-server.com/ingest-log");
		});

		it("should ignore subsequent setConfig calls once configured", () => {
			LogService.setConfig({
				trafficSourceId: "first-source",
				serviceToken: "first-token",
			});

			LogService.setConfig({
				trafficSourceId: "second-source",
				serviceToken: "second-token",
			});

			const config = LogService.getConfig();

			expect(config?.trafficSourceId).toBe("first-source");
			expect(config?.serviceToken).toBe("first-token");
		});

		it("should ignore subsequent setConfig calls with different logBaseApiUrl", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "https://first-server.com",
			});

			LogService.setConfig({
				trafficSourceId: "source-789",
				serviceToken: "token-012",
				logBaseApiUrl: "https://second-server.com",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("https://first-server.com/ingest-log");
		});

		it("should handle logBaseApiUrl with trailing slash", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "https://log-server.com/",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("https://log-server.com//ingest-log");
		});

		it("should handle empty string logBaseApiUrl", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBeNull();
		});
	});

	describe("getConfig", () => {
		it("should return undefined when config is not set", () => {
			const config = LogService.getConfig();

			expect(config).toBeUndefined();
		});

		it("should return the stored configuration", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
			});

			const config = LogService.getConfig();

			expect(config).toEqual({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				apiUrl: null,
			});
		});

		it("should return same reference on multiple calls", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
			});

			const config1 = LogService.getConfig();
			const config2 = LogService.getConfig();

			expect(config1).toBe(config2);
		});
	});

	describe("resetConfig", () => {
		it("should reset configuration to undefined", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
			});

			expect(LogService.getConfig()).toBeDefined();

			LogService.resetConfig();

			expect(LogService.getConfig()).toBeUndefined();
		});

		it("should allow new configuration after reset", () => {
			LogService.setConfig({
				trafficSourceId: "first-source",
				serviceToken: "first-token",
			});

			LogService.resetConfig();

			LogService.setConfig({
				trafficSourceId: "second-source",
				serviceToken: "second-token",
			});

			const config = LogService.getConfig();

			expect(config?.trafficSourceId).toBe("second-source");
			expect(config?.serviceToken).toBe("second-token");
		});

		it("should allow new configuration with different apiUrl after reset", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "https://first-server.com",
			});

			LogService.resetConfig();

			LogService.setConfig({
				trafficSourceId: "source-789",
				serviceToken: "token-012",
				logBaseApiUrl: "https://second-server.com",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("https://second-server.com/ingest-log");
		});

		it("should be safe to call resetConfig when not configured", () => {
			expect(() => LogService.resetConfig()).not.toThrow();
			expect(LogService.getConfig()).toBeUndefined();
		});

		it("should be safe to call resetConfig multiple times", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
			});

			LogService.resetConfig();
			LogService.resetConfig();
			LogService.resetConfig();

			expect(LogService.getConfig()).toBeUndefined();
		});
	});

	describe("singleton behavior", () => {
		it("should maintain state across multiple accesses", () => {
			LogService.setConfig({
				trafficSourceId: "persistent-source",
				serviceToken: "persistent-token",
			});

			expect(LogService.getConfig()?.trafficSourceId).toBe("persistent-source");
			expect(LogService.getConfig()?.serviceToken).toBe("persistent-token");
			expect(LogService.getConfig()?.trafficSourceId).toBe("persistent-source");
		});

		it("should not allow reconfiguration without reset", () => {
			LogService.setConfig({
				trafficSourceId: "original",
				serviceToken: "original",
			});

			for (let i = 0; i < 5; i++) {
				LogService.setConfig({
					trafficSourceId: `attempt-${i}`,
					serviceToken: `attempt-${i}`,
				});
			}

			const config = LogService.getConfig();
			expect(config?.trafficSourceId).toBe("original");
		});
	});

	describe("edge cases", () => {
		it("should handle special characters in trafficSourceId", () => {
			LogService.setConfig({
				trafficSourceId: "source-with-special-chars!@#$%",
				serviceToken: "token-456",
			});

			const config = LogService.getConfig();

			expect(config?.trafficSourceId).toBe("source-with-special-chars!@#$%");
		});

		it("should handle special characters in serviceToken", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-with-special-chars!@#$%^&*()",
			});

			const config = LogService.getConfig();

			expect(config?.serviceToken).toBe("token-with-special-chars!@#$%^&*()");
		});

		it("should handle very long trafficSourceId", () => {
			const longId = "a".repeat(1000);

			LogService.setConfig({
				trafficSourceId: longId,
				serviceToken: "token-456",
			});

			const config = LogService.getConfig();

			expect(config?.trafficSourceId).toBe(longId);
			expect(config?.trafficSourceId.length).toBe(1000);
		});

		it("should handle very long serviceToken", () => {
			const longToken = "t".repeat(1000);

			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: longToken,
			});

			const config = LogService.getConfig();

			expect(config?.serviceToken).toBe(longToken);
			expect(config?.serviceToken.length).toBe(1000);
		});

		it("should handle logBaseApiUrl with port", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "http://localhost:3000",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("http://localhost:3000/ingest-log");
		});

		it("should handle logBaseApiUrl with path", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "https://api.example.com/v1/logs",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("https://api.example.com/v1/logs/ingest-log");
		});

		it("should handle https protocol in logBaseApiUrl", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
				logBaseApiUrl: "https://secure-log-server.com",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toContain("https://");
		});
	});

	describe("serviceToken/userToken separation (SEC-13)", () => {
		it("should require serviceToken or the deprecated userToken alias", () => {
			expect(() =>
				// biome-ignore lint/suspicious/noExplicitAny: exercising the runtime guard for missing token
				LogService.setConfig({ trafficSourceId: "source-123" } as any),
			).toThrow(/serviceToken/);

			expect(LogService.getConfig()).toBeUndefined();
		});

		it("should accept the deprecated userToken alias and store it as serviceToken", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "legacy-token",
			});

			expect(LogService.getConfig()?.serviceToken).toBe("legacy-token");
		});

		it("should log a deprecation warning when userToken is used instead of serviceToken", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "legacy-token",
			});

			expect(flushDebugLogs).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "LogServiceError",
					debugs: [expect.stringContaining("deprecated")],
				}),
			);
		});

		it("should not warn about deprecation when serviceToken is used", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
			});

			expect(flushDebugLogs).not.toHaveBeenCalled();
		});

		it("should prefer serviceToken over userToken when both are provided", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "preferred-token",
				userToken: "ignored-legacy-token",
			});

			expect(LogService.getConfig()?.serviceToken).toBe("preferred-token");
		});

		it("should warn (not silently no-op) when setConfig is called again after being configured", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				serviceToken: "token-456",
			});

			vi.clearAllMocks();

			LogService.setConfig({
				trafficSourceId: "source-789",
				serviceToken: "token-789",
			});

			expect(flushDebugLogs).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "LogServiceError",
					debugs: [expect.stringContaining("singleton")],
				}),
			);
		});

		it("user A's token must not leak to a subsequent 'user B' setConfig call", () => {
			// Simulates the exact misuse the audit flagged: two different
			// per-request contexts calling setConfig with different tokens.
			// The singleton must keep user A's value and never adopt user B's.
			LogService.setConfig({
				trafficSourceId: "app",
				serviceToken: "user-A-token",
			});

			LogService.setConfig({
				trafficSourceId: "app",
				serviceToken: "user-B-token",
			});

			const config = LogService.getConfig();
			expect(config?.serviceToken).toBe("user-A-token");
			expect(config?.serviceToken).not.toBe("user-B-token");
		});

		it("user B must not receive user A's token after a reset+reconfigure cycle", () => {
			LogService.setConfig({
				trafficSourceId: "app",
				serviceToken: "user-A-token",
			});
			LogService.resetConfig();

			LogService.setConfig({
				trafficSourceId: "app",
				serviceToken: "user-B-token",
			});

			const config = LogService.getConfig();
			expect(config?.serviceToken).toBe("user-B-token");
			expect(config?.serviceToken).not.toBe("user-A-token");
		});
	});
});
