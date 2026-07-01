import { describe, expect, it } from "vitest";
import {
	applyMask,
	clear,
	getMask,
	MAX_LENGTH,
	TYPES,
} from "../phoneInputUtilities";

describe("clear", () => {
	it("should remove non-numeric characters", () => {
		expect(clear("(11) 91234-5678")).toBe("11912345678");
	});

	it("should keep a purely numeric string unchanged", () => {
		expect(clear("11912345678")).toBe("11912345678");
	});

	it("should return an empty string when there are no digits", () => {
		expect(clear("abc-()")).toBe("");
	});

	it("should return an empty string for an empty input", () => {
		expect(clear("")).toBe("");
	});
});

describe("getMask", () => {
	it("should return EIGHT for values with 10 or fewer digits", () => {
		expect(getMask("1123456789")).toBe("EIGHT");
	});

	it("should return NINE for values with more than 10 digits", () => {
		expect(getMask("11912345678")).toBe("NINE");
	});

	it("should return EIGHT for an empty string", () => {
		expect(getMask("")).toBe("EIGHT");
	});

	it("should return EIGHT at the exact 10-digit boundary", () => {
		expect(getMask("1234567890")).toBe("EIGHT");
	});

	it("should return NINE just past the 10-digit boundary", () => {
		expect(getMask("12345678901")).toBe("NINE");
	});
});

describe("applyMask", () => {
	it("should apply the EIGHT-digit mask pattern", () => {
		expect(applyMask("1123456789", TYPES.EIGHT)).toBe("(11) 2345-6789");
	});

	it("should apply the NINE-digit mask pattern", () => {
		expect(applyMask("11912345678", TYPES.NINE)).toBe("(11) 91234-5678");
	});

	it("should stop early when the value has fewer digits than the mask", () => {
		expect(applyMask("119", TYPES.NINE)).toBe("(11) 9");
	});

	it("should return an empty string when the value is empty", () => {
		expect(applyMask("", TYPES.NINE)).toBe("");
	});

	it("should not overflow past the mask length even with extra digits", () => {
		expect(applyMask("119123456789999", TYPES.NINE)).toBe("(11) 91234-5678");
	});
});

describe("TYPES", () => {
	it("should expose the EIGHT and NINE mask patterns", () => {
		expect(TYPES.EIGHT).toBe("(99) 9999-9999");
		expect(TYPES.NINE).toBe("(99) 99999-9999");
	});
});

describe("MAX_LENGTH", () => {
	it("should equal the digit count of the NINE mask", () => {
		expect(MAX_LENGTH).toBe(11);
	});
});
