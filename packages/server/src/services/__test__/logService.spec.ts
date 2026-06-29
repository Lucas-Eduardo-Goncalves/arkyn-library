import { beforeEach, describe, expect, it } from "vitest";

import { LogService } from "../logService";

describe("LogService", () => {
	beforeEach(() => {
		LogService.resetConfig();
	});

	describe("setConfig", () => {
		it("should set configuration successfully", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
			});

			const config = LogService.getConfig();

			expect(config).toBeDefined();
			expect(config?.trafficSourceId).toBe("source-123");
			expect(config?.userToken).toBe("token-456");
		});

		it("should use default apiUrl when logBaseApiUrl is not provided", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("http://62.238.8.44:8081/ingest-log");
		});

		it("should use custom logBaseApiUrl when provided", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
				logBaseApiUrl: "https://custom-log-server.com",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("https://custom-log-server.com/ingest-log");
		});

		it("should ignore subsequent setConfig calls once configured", () => {
			LogService.setConfig({
				trafficSourceId: "first-source",
				userToken: "first-token",
			});

			LogService.setConfig({
				trafficSourceId: "second-source",
				userToken: "second-token",
			});

			const config = LogService.getConfig();

			expect(config?.trafficSourceId).toBe("first-source");
			expect(config?.userToken).toBe("first-token");
		});

		it("should ignore subsequent setConfig calls with different logBaseApiUrl", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
				logBaseApiUrl: "https://first-server.com",
			});

			LogService.setConfig({
				trafficSourceId: "source-789",
				userToken: "token-012",
				logBaseApiUrl: "https://second-server.com",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("https://first-server.com/ingest-log");
		});

		it("should handle logBaseApiUrl with trailing slash", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
				logBaseApiUrl: "https://log-server.com/",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("https://log-server.com//ingest-log");
		});

		it("should handle empty string logBaseApiUrl", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
				logBaseApiUrl: "",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("http://62.238.8.44:8081/ingest-log");
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
				userToken: "token-456",
			});

			const config = LogService.getConfig();

			expect(config).toEqual({
				trafficSourceId: "source-123",
				userToken: "token-456",
				apiUrl: "http://62.238.8.44:8081/ingest-log",
			});
		});

		it("should return same reference on multiple calls", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
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
				userToken: "token-456",
			});

			expect(LogService.getConfig()).toBeDefined();

			LogService.resetConfig();

			expect(LogService.getConfig()).toBeUndefined();
		});

		it("should allow new configuration after reset", () => {
			LogService.setConfig({
				trafficSourceId: "first-source",
				userToken: "first-token",
			});

			LogService.resetConfig();

			LogService.setConfig({
				trafficSourceId: "second-source",
				userToken: "second-token",
			});

			const config = LogService.getConfig();

			expect(config?.trafficSourceId).toBe("second-source");
			expect(config?.userToken).toBe("second-token");
		});

		it("should allow new configuration with different apiUrl after reset", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
				logBaseApiUrl: "https://first-server.com",
			});

			LogService.resetConfig();

			LogService.setConfig({
				trafficSourceId: "source-789",
				userToken: "token-012",
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
				userToken: "token-456",
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
				userToken: "persistent-token",
			});

			expect(LogService.getConfig()?.trafficSourceId).toBe("persistent-source");
			expect(LogService.getConfig()?.userToken).toBe("persistent-token");
			expect(LogService.getConfig()?.trafficSourceId).toBe("persistent-source");
		});

		it("should not allow reconfiguration without reset", () => {
			LogService.setConfig({
				trafficSourceId: "original",
				userToken: "original",
			});

			for (let i = 0; i < 5; i++) {
				LogService.setConfig({
					trafficSourceId: `attempt-${i}`,
					userToken: `attempt-${i}`,
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
				userToken: "token-456",
			});

			const config = LogService.getConfig();

			expect(config?.trafficSourceId).toBe("source-with-special-chars!@#$%");
		});

		it("should handle special characters in userToken", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-with-special-chars!@#$%^&*()",
			});

			const config = LogService.getConfig();

			expect(config?.userToken).toBe("token-with-special-chars!@#$%^&*()");
		});

		it("should handle very long trafficSourceId", () => {
			const longId = "a".repeat(1000);

			LogService.setConfig({
				trafficSourceId: longId,
				userToken: "token-456",
			});

			const config = LogService.getConfig();

			expect(config?.trafficSourceId).toBe(longId);
			expect(config?.trafficSourceId.length).toBe(1000);
		});

		it("should handle very long userToken", () => {
			const longToken = "t".repeat(1000);

			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: longToken,
			});

			const config = LogService.getConfig();

			expect(config?.userToken).toBe(longToken);
			expect(config?.userToken.length).toBe(1000);
		});

		it("should handle logBaseApiUrl with port", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
				logBaseApiUrl: "http://localhost:3000",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("http://localhost:3000/ingest-log");
		});

		it("should handle logBaseApiUrl with path", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
				logBaseApiUrl: "https://api.example.com/v1/logs",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toBe("https://api.example.com/v1/logs/ingest-log");
		});

		it("should handle https protocol in logBaseApiUrl", () => {
			LogService.setConfig({
				trafficSourceId: "source-123",
				userToken: "token-456",
				logBaseApiUrl: "https://secure-log-server.com",
			});

			const config = LogService.getConfig();

			expect(config?.apiUrl).toContain("https://");
		});
	});
});
