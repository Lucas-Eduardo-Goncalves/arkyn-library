import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("findCountryMask", () => {
  it("returns mask and country when country's mask is a string", async () => {
    vi.doMock("libphonenumber-js", () => ({
      parsePhoneNumberWithError: () => ({
        country: "US",
        nationalNumber: "2125550199",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [
        {
          iso: "US",
          mask: "(___) ___-____",
          name: "United States",
          code: "+1",
          flag: "🇺🇸",
        },
      ],
    }));

    const { findCountryMask } = await import("../findCountryMask");
    const [mask, country] = findCountryMask("+12125550199");

    expect(mask).toBe("(___) ___-____");
    expect(country.iso).toBe("US");
  });

  it("selects the correct mask from an array based on national number length", async () => {
    vi.doMock("libphonenumber-js", () => ({
      parsePhoneNumberWithError: () => ({
        country: "BR",
        nationalNumber: "11999999999",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [
        {
          iso: "BR",
          name: "Brazil",
          code: "+55",
          flag: "🇧🇷",
          mask: ["(__) _____-____", "(__) ____-____"],
        },
      ],
    }));

    const { findCountryMask } = await import("../findCountryMask");
    const [mask, country] = findCountryMask("+5511999999999");

    expect(mask).toBe("(__) _____-____");
    expect(country.iso).toBe("BR");
  });

  it("throws when parsed phone has no country", async () => {
    vi.doMock("libphonenumber-js", () => ({
      parsePhoneNumberWithError: () => ({
        country: undefined,
        nationalNumber: "123",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [{ iso: "BR", mask: "(__) _____-____" }],
    }));

    const { findCountryMask } = await import("../findCountryMask");
    expect(() => findCountryMask("123")).toThrow("Invalid phone number");
  });

  it("throws when country is not supported by templates", async () => {
    vi.doMock("libphonenumber-js", () => ({
      parsePhoneNumberWithError: () => ({
        country: "MX",
        nationalNumber: "5512345678",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [{ iso: "BR", mask: "(__) _____-____" }],
    }));

    const { findCountryMask } = await import("../findCountryMask");
    expect(() => findCountryMask("+525512345678")).toThrow(
      "Phone number country not supported",
    );
  });

  it("throws when no mask matches the phone number length", async () => {
    vi.doMock("libphonenumber-js", () => ({
      parsePhoneNumberWithError: () => ({
        country: "BR",
        nationalNumber: "12345",
      }),
    }));

    vi.doMock("@arkyn/templates", () => ({
      countries: [
        {
          iso: "BR",
          mask: ["(__) _____-____", "(__) ____-____"],
        },
      ],
    }));

    const { findCountryMask } = await import("../findCountryMask");
    expect(() => findCountryMask("+5512345")).toThrow(
      "No mask found for the given phone number length",
    );
  });
});
