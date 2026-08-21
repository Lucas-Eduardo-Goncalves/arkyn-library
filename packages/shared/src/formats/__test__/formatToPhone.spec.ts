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

	it("should format a Chinese mobile number with the corrected 11-digit mask (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: (_phone: string) => ({
				country: "CN",
				nationalNumber: "13123456789",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [
				{ iso: "CN", name: "China", code: "+86", mask: "___ ____ ____" },
			],
		}));

		const { formatToPhone } = await import("../formatToPhone");
		const result = formatToPhone("+8613123456789");
		expect(result).toBe("131 2345 6789");
	});

	it("should format an Argentinian mobile number with the leading-9 mask (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: (_phone: string) => ({
				country: "AR",
				nationalNumber: "91123456789",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [
				{
					iso: "AR",
					name: "Argentina",
					code: "+54",
					mask: ["_ __ ____-____", "__ ____-____"],
				},
			],
		}));

		const { formatToPhone } = await import("../formatToPhone");
		const result = formatToPhone("+5491123456789");
		expect(result).toBe("9 11 2345-6789");
	});

	it("should format a South Korean mobile number with the corrected 10-digit mask (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: (_phone: string) => ({
				country: "KR",
				nationalNumber: "1020000000",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [
				{
					iso: "KR",
					name: "Korea, Republic of South Korea",
					code: "+82",
					mask: "__-____-____",
				},
			],
		}));

		const { formatToPhone } = await import("../formatToPhone");
		const result = formatToPhone("+821020000000");
		expect(result).toBe("10-2000-0000");
	});

	it("should format an Indonesian mobile number by matching the correct variable-length mask (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: (_phone: string) => ({
				country: "ID",
				nationalNumber: "85691234567",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [
				{
					iso: "ID",
					name: "Indonesia",
					code: "+62",
					mask: ["___ ____ ____", "___ ____ ___", "___ ___ ___"],
				},
			],
		}));

		const { formatToPhone } = await import("../formatToPhone");
		const result = formatToPhone("+6285691234567");
		expect(result).toBe("856 9123 4567");
	});

	it("should format a Vietnamese mobile number with the corrected 9-digit mask (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: (_phone: string) => ({
				country: "VN",
				nationalNumber: "912345678",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [
				{ iso: "VN", name: "Vietnam", code: "+84", mask: "___ ___ ___" },
			],
		}));

		const { formatToPhone } = await import("../formatToPhone");
		const result = formatToPhone("+84912345678");
		expect(result).toBe("912 345 678");
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
