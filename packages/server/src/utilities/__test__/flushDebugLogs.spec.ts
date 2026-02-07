import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { flushDebugLogs } from "../flushDebugLogs";

describe("flushDebugLogs", () => {
  const originalEnv = process.env;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    process.env = { ...originalEnv };
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    consoleSpy.mockRestore();
  });

  describe("debug mode activation", () => {
    it("should log when NODE_ENV is development", () => {
      process.env.NODE_ENV = "development";

      flushDebugLogs({
        name: "TEST",
        scheme: "cyan",
        debugs: ["Test message"],
      });

      expect(consoleSpy).toHaveBeenCalled();
    });

    it("should log when DEBUG_MODE is true", () => {
      process.env.NODE_ENV = "production";
      process.env.DEBUG_MODE = "true";

      flushDebugLogs({
        name: "TEST",
        scheme: "cyan",
        debugs: ["Test message"],
      });

      expect(consoleSpy).toHaveBeenCalled();
    });

    it("should not log when not in debug mode", () => {
      process.env.NODE_ENV = "production";
      process.env.DEBUG_MODE = "false";

      flushDebugLogs({
        name: "TEST",
        scheme: "cyan",
        debugs: ["Test message"],
      });

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("should not log when NODE_ENV is undefined and DEBUG_MODE is not true", () => {
      delete process.env.NODE_ENV;
      delete process.env.DEBUG_MODE;

      flushDebugLogs({
        name: "TEST",
        scheme: "cyan",
        debugs: ["Test message"],
      });

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe("color schemes", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should use yellow color for yellow scheme", () => {
      flushDebugLogs({
        name: "WARNING",
        scheme: "yellow",
        debugs: ["Warning message"],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("\x1b[33m");
      expect(output).toContain("[WARNING]");
    });

    it("should use cyan color for cyan scheme", () => {
      flushDebugLogs({
        name: "INFO",
        scheme: "cyan",
        debugs: ["Info message"],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("\x1b[36m");
      expect(output).toContain("[INFO]");
    });

    it("should use red color for red scheme", () => {
      flushDebugLogs({
        name: "ERROR",
        scheme: "red",
        debugs: ["Error message"],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("\x1b[31m");
      expect(output).toContain("[ERROR]");
    });

    it("should use green color for green scheme", () => {
      flushDebugLogs({
        name: "SUCCESS",
        scheme: "green",
        debugs: ["Success message"],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("\x1b[32m");
      expect(output).toContain("[SUCCESS]");
    });

    it("should include reset code after color", () => {
      flushDebugLogs({
        name: "TEST",
        scheme: "cyan",
        debugs: ["Test message"],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("\x1b[0m");
    });
  });

  describe("debug messages formatting", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should log single debug message", () => {
      flushDebugLogs({
        name: "API",
        scheme: "cyan",
        debugs: ["Single message"],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("Single message");
    });

    it("should log multiple debug messages", () => {
      flushDebugLogs({
        name: "API",
        scheme: "cyan",
        debugs: ["First message", "Second message", "Third message"],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("First message");
      expect(output).toContain("Second message");
      expect(output).toContain("Third message");
    });

    it("should prefix each message with the name tag", () => {
      flushDebugLogs({
        name: "DB",
        scheme: "green",
        debugs: ["Message 1", "Message 2"],
      });

      const output = consoleSpy.mock.calls[0][0] as any;
      const matches = output.match(/\[DB\]/g);
      expect(matches).toHaveLength(2);
    });

    it("should trim whitespace from debug messages", () => {
      flushDebugLogs({
        name: "TEST",
        scheme: "cyan",
        debugs: ["  trimmed message  "],
      });

      const output = consoleSpy.mock.calls[0][0] as any;
      expect(output).toContain("trimmed message");
      expect(output).not.toContain("  trimmed message  ");
    });

    it("should start output with newline", () => {
      flushDebugLogs({
        name: "TEST",
        scheme: "cyan",
        debugs: ["Message"],
      });

      const output = consoleSpy.mock.calls[0][0] as any;
      expect(output.startsWith("\n")).toBe(true);
    });

    it("should handle empty debugs array", () => {
      flushDebugLogs({
        name: "TEST",
        scheme: "cyan",
        debugs: [],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toBe("\n");
    });
  });

  describe("name formatting", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should wrap name in brackets", () => {
      flushDebugLogs({
        name: "CustomName",
        scheme: "yellow",
        debugs: ["Test"],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("[CustomName]");
    });

    it("should handle special characters in name", () => {
      flushDebugLogs({
        name: "API-v2.0",
        scheme: "cyan",
        debugs: ["Test"],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("[API-v2.0]");
    });

    it("should handle empty name", () => {
      flushDebugLogs({
        name: "",
        scheme: "cyan",
        debugs: ["Test"],
      });

      const output = consoleSpy.mock.calls[0][0];
      expect(output).toContain("[]");
    });
  });
});
