import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("validatePhone", () => {
  it("should return true for a valid phone and supported country", async () => {
    vi.doMock("libphonenumber-js", () => ({
      isValidPhoneNumber: () => true,
      parsePhoneNumberWithError: () => ({
        country: "BR",
        nationalNumber: "11999999999",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [{ iso: "BR", mask: "(__) _____-____" }],
    }));

    const { validatePhone } = await import("../validatePhone");
    const result = validatePhone("+5511999999999");
    expect(result).toBe(true);
  });

  it("should return true for another supported country", async () => {
    vi.doMock("libphonenumber-js", () => ({
      isValidPhoneNumber: () => true,
      parsePhoneNumberWithError: () => ({
        country: "US",
        nationalNumber: "2125550199",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [{ iso: "US", mask: "(___) ___-____" }],
    }));

    const { validatePhone } = await import("../validatePhone");
    const result = validatePhone("+12125550199");
    expect(result).toBe(true);
  });

  it("should return false when isValidPhoneNumber is false", async () => {
    vi.doMock("libphonenumber-js", () => ({
      isValidPhoneNumber: () => false,
      parsePhoneNumberWithError: () => ({
        country: "BR",
        nationalNumber: "123",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [{ iso: "BR", mask: "(__) _____-____" }],
    }));

    const { validatePhone } = await import("../validatePhone");
    const result = validatePhone("invalid");
    expect(result).toBe(false);
  });

  it("should return false when parsed phone has no country", async () => {
    vi.doMock("libphonenumber-js", () => ({
      isValidPhoneNumber: () => true,
      parsePhoneNumberWithError: () => ({
        country: undefined,
        nationalNumber: "123",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [{ iso: "BR", mask: "(__) _____-____" }],
    }));

    const { validatePhone } = await import("../validatePhone");
    const result = validatePhone("123");
    expect(result).toBe(false);
  });

  it("should return false when country is not supported by templates", async () => {
    vi.doMock("libphonenumber-js", () => ({
      isValidPhoneNumber: () => true,
      parsePhoneNumberWithError: () => ({
        country: "MX",
        nationalNumber: "5512345678",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [{ iso: "BR", mask: "(__) _____-____" }],
    }));

    const { validatePhone } = await import("../validatePhone");
    const result = validatePhone("+525512345678");
    expect(result).toBe(false);
  });

  it("should return false for empty string input", async () => {
    vi.doMock("libphonenumber-js", () => ({
      isValidPhoneNumber: () => false,
      parsePhoneNumberWithError: () => ({
        country: undefined,
        nationalNumber: "",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [],
    }));

    const { validatePhone } = await import("../validatePhone");
    const result = validatePhone("");
    expect(result).toBe(false);
  });
});
