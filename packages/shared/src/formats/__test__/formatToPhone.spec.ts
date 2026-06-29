import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
	vi.resetModules();
	vi.restoreAllMocks();
});

afterEach(() => {
	vi.resetAllMocks();
});

describe("formatToPhone", () => {
	it("should format a phone number using the country mask", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: (_phone: string) => ({
				country: "BR",
				nationalNumber: "11999999999",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [{ iso: "BR", mask: "(__) _____-____" }],
		}));

		const { formatToPhone } = await import("../formatToPhone");
		const result = formatToPhone("+5511999999999");
		expect(result).toBe("(11) 99999-9999");
	});

	it("should throw when parsed phone has no country", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: () => ({
				country: undefined,
				nationalNumber: "123",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [{ iso: "BR", mask: "(__) _____-____" }],
		}));

		const { formatToPhone } = await import("../formatToPhone");
		expect(() => formatToPhone("invalid")).toThrow("Invalid phone number");
	});

	it("should throw when country is not supported by templates", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: () => ({
				country: "US",
				nationalNumber: "2125551234",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [{ iso: "BR", mask: "(__) _____-____" }],
		}));

		const { formatToPhone } = await import("../formatToPhone");
		expect(() => formatToPhone("+19706574613")).toThrow(
			"Phone number country not supported",
		);
	});

	it("should ignore extra digits beyond the mask placeholders", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: () => ({
				country: "BR",
				nationalNumber: "11987654321",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [{ iso: "BR", mask: "(__) ___-____" }],
		}));

		const { formatToPhone } = await import("../formatToPhone");
		const result = formatToPhone("+5511987654321");
		expect(result).toBe("(11) 987-6543");
	});
});
