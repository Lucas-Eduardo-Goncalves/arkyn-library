import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

	it("returns the corrected 11-digit mask for China (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: () => ({
				country: "CN",
				nationalNumber: "13123456789",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [
				{
					iso: "CN",
					name: "China",
					code: "+86",
					flag: "🇨🇳",
					mask: "___ ____ ____",
				},
			],
		}));

		const { findCountryMask } = await import("../findCountryMask");
		const [mask, country] = findCountryMask("+8613123456789");

		expect(mask).toBe("___ ____ ____");
		expect(country.iso).toBe("CN");
	});

	it("selects the mobile (11-digit, with leading 9) mask for Argentina (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: () => ({
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
					flag: "🇦🇷",
					mask: ["_ __ ____-____", "__ ____-____"],
				},
			],
		}));

		const { findCountryMask } = await import("../findCountryMask");
		const [mask, country] = findCountryMask("+5491123456789");

		expect(mask).toBe("_ __ ____-____");
		expect(country.iso).toBe("AR");
	});

	it("selects the landline (10-digit) mask for Argentina (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: () => ({
				country: "AR",
				nationalNumber: "1123456789",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [
				{
					iso: "AR",
					name: "Argentina",
					code: "+54",
					flag: "🇦🇷",
					mask: ["_ __ ____-____", "__ ____-____"],
				},
			],
		}));

		const { findCountryMask } = await import("../findCountryMask");
		const [mask, country] = findCountryMask("+541123456789");

		expect(mask).toBe("__ ____-____");
		expect(country.iso).toBe("AR");
	});

	it("returns the corrected 10-digit mask for South Korea (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: () => ({
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
					flag: "🇰🇷",
					mask: "__-____-____",
				},
			],
		}));

		const { findCountryMask } = await import("../findCountryMask");
		const [mask, country] = findCountryMask("+821020000000");

		expect(mask).toBe("__-____-____");
		expect(country.iso).toBe("KR");
	});

	it("selects the correct length mask for Indonesia among variable-length mobiles (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: () => ({
				country: "ID",
				nationalNumber: "8123456789",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [
				{
					iso: "ID",
					name: "Indonesia",
					code: "+62",
					flag: "🇮🇩",
					mask: ["___ ____ ____", "___ ____ ___", "___ ___ ___"],
				},
			],
		}));

		const { findCountryMask } = await import("../findCountryMask");
		const [mask, country] = findCountryMask("+628123456789");

		expect(mask).toBe("___ ____ ___");
		expect(country.iso).toBe("ID");
	});

	it("returns the corrected 9-digit mask for Vietnam (BUG-01)", async () => {
		vi.doMock("libphonenumber-js", () => ({
			parsePhoneNumberWithError: () => ({
				country: "VN",
				nationalNumber: "912345678",
			}),
		}));

		vi.doMock("@arkyn/templates", () => ({
			countries: [
				{
					iso: "VN",
					name: "Vietnam",
					code: "+84",
					flag: "🇻🇳",
					mask: "___ ___ ___",
				},
			],
		}));

		const { findCountryMask } = await import("../findCountryMask");
		const [mask, country] = findCountryMask("+84912345678");

		expect(mask).toBe("___ ___ ___");
		expect(country.iso).toBe("VN");
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
