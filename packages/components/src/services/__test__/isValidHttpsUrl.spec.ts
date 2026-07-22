import { describe, expect, it } from "vitest";
import { isValidHttpsUrl } from "../isValidHttpsUrl";

describe("isValidHttpsUrl", () => {
	it("should accept a plain https URL", () => {
		expect(isValidHttpsUrl("https://arkyn.dev")).toBe(true);
	});

	it("should accept an https URL with a path and query string", () => {
		expect(isValidHttpsUrl("https://arkyn.dev/docs?tab=richText")).toBe(true);
	});

	it("should reject an http URL", () => {
		expect(isValidHttpsUrl("http://arkyn.dev")).toBe(false);
	});

	it("should reject a URL with a non-http protocol", () => {
		expect(isValidHttpsUrl("ftp://arkyn.dev")).toBe(false);
	});

	it("should reject a protocol-relative URL", () => {
		expect(isValidHttpsUrl("//arkyn.dev")).toBe(false);
	});

	it("should reject a string with no protocol at all", () => {
		expect(isValidHttpsUrl("arkyn.dev")).toBe(false);
	});

	it("should reject a malformed string", () => {
		expect(isValidHttpsUrl("not a url")).toBe(false);
	});

	it("should reject an empty string", () => {
		expect(isValidHttpsUrl("")).toBe(false);
	});
});
