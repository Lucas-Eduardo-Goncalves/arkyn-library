import { describe, expect, it } from "vitest";
import { validateEmail } from "../validateEmail";

describe("validateEmail", () => {
  describe("Basic format validation", () => {
    it("should return false for empty or null email", async () => {
      expect(await validateEmail("")).toBe(false);
      expect(await validateEmail(null as unknown as string)).toBe(false);
      expect(await validateEmail(undefined as unknown as string)).toBe(false);
    });

    it("should return false for invalid basic format", async () => {
      expect(await validateEmail("invalid-email")).toBe(false);
      expect(await validateEmail("@domain.com")).toBe(false);
      expect(await validateEmail("user@")).toBe(false);
      expect(await validateEmail("user@@domain.com")).toBe(false);
      expect(await validateEmail("user..name@domain.com")).toBe(false);
      expect(await validateEmail(".user@domain.com")).toBe(false);
      expect(await validateEmail("user.@domain.com")).toBe(false);
    });

    it("should handle emails with spaces", async () => {
      expect(await validateEmail(" user@gmail.com ")).toBe(true);
      expect(await validateEmail("user @gmail.com")).toBe(false);
      expect(await validateEmail("user@ gmail.com")).toBe(false);
    });
  });

  describe("Local part validation", () => {
    it("should reject local part that is too long", async () => {
      const longLocal = "a".repeat(65) + "@gmail.com";
      expect(await validateEmail(longLocal)).toBe(false);
    });

    it("should accept valid special characters in local part", async () => {
      expect(await validateEmail("user+tag@gmail.com")).toBe(true);
      expect(await validateEmail("user.name@gmail.com")).toBe(true);
      expect(await validateEmail("user_name@gmail.com")).toBe(true);
      expect(await validateEmail("user-name@gmail.com")).toBe(true);
    });

    it("should reject consecutive dots in local part", async () => {
      expect(await validateEmail("user..name@gmail.com")).toBe(false);
    });
  });

  describe("Domain part validation", () => {
    it("should reject domain that is too long", async () => {
      const longDomain = "user@" + "a".repeat(250) + ".com";
      expect(await validateEmail(longDomain)).toBe(false);
    });

    it("should reject domains without TLD", async () => {
      expect(await validateEmail("user@localhost")).toBe(false);
    });

    it("should reject invalid TLD", async () => {
      expect(await validateEmail("user@domain.1")).toBe(false);
      expect(await validateEmail("user@domain.a")).toBe(false);
    });

    it("should accept valid domains", async () => {
      expect(await validateEmail("user@sub.domain.com")).toBe(true);
      expect(await validateEmail("user@github.com")).toBe(true);
    });
  });

  describe("DNS validation", () => {
    it("should return true for valid domains with DNS records", async () => {
      expect(await validateEmail("test@gmail.com")).toBe(true);
      expect(await validateEmail("user@yahoo.com")).toBe(true);
      expect(await validateEmail("contact@microsoft.com")).toBe(true);
    });

    it("should return false for domains without DNS records", async () => {
      expect(await validateEmail("user@nonexistentdomain12345.com")).toBe(
        false
      );
      expect(
        await validateEmail("user@thisisnotarealdomainfortesting.com")
      ).toBe(false);
      expect(await validateEmail("user@fakeinvalidtestdomain123456.xyz")).toBe(
        false
      );
      expect(await validateEmail("user@example-site-does-not-exist.org")).toBe(
        false
      );
    });

    it("should handle domains with only A records", async () => {
      expect(await validateEmail("admin@github.com")).toBe(true);
    });

    it("should handle subdomains correctly", async () => {
      expect(await validateEmail("user@mail.google.com")).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle international domains", async () => {
      expect(await validateEmail("user@example.co.uk")).toBe(true);
    });

    it("should reject emails with invalid characters", async () => {
      expect(await validateEmail("user@domain..com")).toBe(false);
      expect(await validateEmail("user@-domain.com")).toBe(false);
      expect(await validateEmail("user@domain-.com")).toBe(false);
    });

    it("should handle case insensitivity in domain", async () => {
      expect(await validateEmail("User@GMAIL.COM")).toBe(true);
    });
  });

  describe("Real world examples", () => {
    it("should validate common email formats", async () => {
      const validEmails = [
        "user@gmail.com",
        "john.doe@microsoft.com",
        "admin@github.com",
        "user123@yahoo.com",
      ];

      for (const email of validEmails) {
        expect(await validateEmail(email)).toBe(true);
      }
    }, 10000);

    it("should reject common typos", async () => {
      const invalidEmails = [
        "user@gmailcom.fake", // typo in gmail
        "user@yhoo.fake", // typo in yahoo
        "user@hotmailcom.fake", // typo in hotmail
        "user@outlookcom.fake", // typo in outlook
      ];

      for (const email of invalidEmails) {
        expect(await validateEmail(email)).toBe(false);
      }
    });
  });
});
