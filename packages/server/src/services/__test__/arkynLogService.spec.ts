import { describe, expect, it } from "vitest";
import { ArkynLogService } from "../arkynLogService";

describe("ArkynLogService", () => {
  it("should set the arkyn configuration if not already set", () => {
    const arkynConfig = {
      arkynTrafficSourceId: "channel-123",
      arkynUserToken: "user-token-abc",
      arkynLogBaseApiUrl: "https://custom-arkyn-api.com",
    };

    ArkynLogService.setArkynConfig(arkynConfig);

    const config = ArkynLogService.getArkynConfig();
    expect(config).toEqual({
      arkynTrafficSourceId: "channel-123",
      arkynUserToken: "user-token-abc",
      arkynApiUrl:
        "https://custom-arkyn-api.com/http-traffic-records/:trafficSourceId",
    });
  });

  it("should not overwrite the arkyn configuration if already set", () => {
    const initialConfig = {
      arkynTrafficSourceId: "channel-123",
      arkynUserToken: "user-token-abc",
      arkynLogBaseApiUrl: "https://custom-arkyn-api.com",
    };

    const newConfig = {
      arkynTrafficSourceId: "channel-456",
      arkynUserToken: "user-token-def",
      arkynLogBaseApiUrl: "https://another-arkyn-api.com",
    };

    ArkynLogService.setArkynConfig(initialConfig);
    ArkynLogService.setArkynConfig(newConfig);

    const config = ArkynLogService.getArkynConfig();
    expect(config).toEqual({
      arkynTrafficSourceId: "channel-123",
      arkynUserToken: "user-token-abc",
      arkynApiUrl:
        "https://custom-arkyn-api.com/http-traffic-records/:trafficSourceId",
    });
  });

  it("should return undefined if no configuration is set", () => {
    ArkynLogService.resetArkynConfig();

    const config = ArkynLogService.getArkynConfig();
    expect(config).toBeUndefined();
  });

  it("should use the default API URL if none is provided", () => {
    const arkynConfig = {
      arkynTrafficSourceId: "channel-123",
      arkynUserToken: "user-token-abc",
    };

    const defaultArkynURL = `https://logs-arkyn-flow-logs.vw6wo7.easypanel.host/http-traffic-records/:trafficSourceId`;

    ArkynLogService.setArkynConfig(arkynConfig);

    const config = ArkynLogService.getArkynConfig();
    expect(config).toEqual({
      ...arkynConfig,
      arkynApiUrl: defaultArkynURL,
    });
  });
});
