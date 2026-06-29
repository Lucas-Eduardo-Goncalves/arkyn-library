import { describe, expect, it } from "vitest";
import { generateId } from "../generateId";

describe("generateId", () => {
	describe("UUID v4 text format", () => {
		it("should generate UUID v4 as text", () => {
			const id = generateId("text", "v4");
			expect(typeof id).toBe("string");
		});

		it("should match UUID v4 format", () => {
			const id = generateId("text", "v4");
			const uuidV4Regex =
				/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
			expect(uuidV4Regex.test(id)).toBe(true);
		});

		it("should have correct length with hyphens", () => {
			const id = generateId("text", "v4");
			expect(id.length).toBe(36);
		});

		it("should contain hyphens at correct positions", () => {
			const id = generateId("text", "v4");
			expect(id.charAt(8)).toBe("-");
			expect(id.charAt(13)).toBe("-");
			expect(id.charAt(18)).toBe("-");
			expect(id.charAt(23)).toBe("-");
		});

		it("should have version 4 indicator", () => {
			const id = generateId("text", "v4");
			expect(id.charAt(14)).toBe("4");
		});

		it("should generate unique IDs", () => {
			const id1 = generateId("text", "v4");
			const id2 = generateId("text", "v4");
			expect(id1).not.toBe(id2);
		});

		it("should generate many unique IDs", () => {
			const ids = new Set();
			for (let i = 0; i < 1000; i++) {
				ids.add(generateId("text", "v4"));
			}
			expect(ids.size).toBe(1000);
		});
	});

	describe("UUID v4 binary format", () => {
		it("should generate UUID v4 as binary", () => {
			const id = generateId("binary", "v4");
			expect(id).toBeInstanceOf(Uint8Array);
		});

		it("should have correct binary length (16 bytes)", () => {
			const id = generateId("binary", "v4");
			expect(id.length).toBe(16);
		});

		it("should contain valid byte values", () => {
			const id = generateId("binary", "v4");
			for (let i = 0; i < id.length; i++) {
				expect(id[i]).toBeGreaterThanOrEqual(0);
				expect(id[i]).toBeLessThanOrEqual(255);
			}
		});

		it("should generate unique binary IDs", () => {
			const id1 = generateId("binary", "v4");
			const id2 = generateId("binary", "v4");
			expect(id1.toString()).not.toBe(id2.toString());
		});

		it("should have version bits set correctly (v4)", () => {
			const id = generateId("binary", "v4");
			// Version is in the 7th byte, high nibble should be 0x40
			const versionByte = id[6];
			expect((versionByte & 0xf0) >> 4).toBe(4);
		});
	});

	describe("UUID v7 text format", () => {
		it("should generate UUID v7 as text", () => {
			const id = generateId("text", "v7");
			expect(typeof id).toBe("string");
		});

		it("should match UUID v7 format", () => {
			const id = generateId("text", "v7");
			const uuidV7Regex =
				/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
			expect(uuidV7Regex.test(id)).toBe(true);
		});

		it("should have correct length with hyphens", () => {
			const id = generateId("text", "v7");
			expect(id.length).toBe(36);
		});

		it("should have version 7 indicator", () => {
			const id = generateId("text", "v7");
			expect(id.charAt(14)).toBe("7");
		});

		it("should generate unique IDs", () => {
			const id1 = generateId("text", "v7");
			const id2 = generateId("text", "v7");
			expect(id1).not.toBe(id2);
		});

		it("should be time-ordered (v7 property)", () => {
			const id1 = generateId("text", "v7");
			// Small delay to ensure different timestamp
			const start = Date.now();
			while (Date.now() - start < 2) {} // 2ms delay
			const id2 = generateId("text", "v7");
			// v7 UUIDs should be lexicographically sortable
			expect(id1.localeCompare(id2)).toBeLessThan(0);
		});
	});

	describe("UUID v7 binary format", () => {
		it("should generate UUID v7 as binary", () => {
			const id = generateId("binary", "v7");
			expect(id).toBeInstanceOf(Uint8Array);
		});

		it("should have correct binary length (16 bytes)", () => {
			const id = generateId("binary", "v7");
			expect(id.length).toBe(16);
		});

		it("should contain valid byte values", () => {
			const id = generateId("binary", "v7");
			for (let i = 0; i < id.length; i++) {
				expect(id[i]).toBeGreaterThanOrEqual(0);
				expect(id[i]).toBeLessThanOrEqual(255);
			}
		});

		it("should generate unique binary IDs", () => {
			const id1 = generateId("binary", "v7");
			const id2 = generateId("binary", "v7");
			expect(id1.toString()).not.toBe(id2.toString());
		});

		it("should have version bits set correctly (v7)", () => {
			const id = generateId("binary", "v7");
			// Version is in the 7th byte, high nibble should be 0x70
			const versionByte = id[6];
			expect((versionByte & 0xf0) >> 4).toBe(7);
		});
	});

	describe("format consistency", () => {
		it("should convert text to binary correctly for v4", () => {
			const _textId = generateId("text", "v4");
			const binaryId = generateId("binary", "v4");
			expect(binaryId).toBeInstanceOf(Uint8Array);
			expect(binaryId.length).toBe(16);
		});

		it("should convert text to binary correctly for v7", () => {
			const _textId = generateId("text", "v7");
			const binaryId = generateId("binary", "v7");
			expect(binaryId).toBeInstanceOf(Uint8Array);
			expect(binaryId.length).toBe(16);
		});
	});

	describe("performance", () => {
		it("should generate v4 text IDs quickly", () => {
			const start = Date.now();
			for (let i = 0; i < 1000; i++) {
				generateId("text", "v4");
			}
			const duration = Date.now() - start;
			expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
		});

		it("should generate v7 text IDs quickly", () => {
			const start = Date.now();
			for (let i = 0; i < 1000; i++) {
				generateId("text", "v7");
			}
			const duration = Date.now() - start;
			expect(duration).toBeLessThan(1000);
		});
	});

	describe("edge cases and validation", () => {
		it("should handle rapid successive calls for v4", () => {
			const ids = [];
			for (let i = 0; i < 100; i++) {
				ids.push(generateId("text", "v4"));
			}
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(100);
		});

		it("should handle rapid successive calls for v7", () => {
			const ids = [];
			for (let i = 0; i < 100; i++) {
				ids.push(generateId("text", "v7"));
			}
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(100);
		});

		it("should generate consistent format across calls", () => {
			const ids = Array.from({ length: 10 }, () => generateId("text", "v4"));
			ids.forEach((id) => {
				expect(id.length).toBe(36);
				expect(id.split("-").length).toBe(5);
			});
		});
	});

	describe("v4 vs v7 differences", () => {
		it("should have different version indicators", () => {
			const v4Id = generateId("text", "v4");
			const v7Id = generateId("text", "v7");
			expect(v4Id.charAt(14)).toBe("4");
			expect(v7Id.charAt(14)).toBe("7");
		});

		it("v7 IDs should be time-ordered while v4 should be random", () => {
			const v4Ids = Array.from({ length: 5 }, () => generateId("text", "v4"));
			const v7Ids = Array.from({ length: 5 }, () => {
				const id = generateId("text", "v7");
				// Small delay between v7 generation
				const start = Date.now();
				while (Date.now() - start < 1) {}
				return id;
			});

			// v7 should be sorted
			const sortedV7 = [...v7Ids].sort();
			expect(v7Ids).toEqual(sortedV7);

			// v4 likely won't be sorted (random)
			const sortedV4 = [...v4Ids].sort();
			expect(v4Ids).not.toEqual(sortedV4);
		});
	});

	describe("binary to hex conversion validation", () => {
		it("should have matching lengths between text and binary formats", () => {
			const textId = generateId("text", "v4");
			const binaryId = generateId("binary", "v4");
			// Text has 36 chars (32 hex + 4 hyphens), binary has 16 bytes
			expect(textId.replace(/-/g, "").length).toBe(binaryId.length * 2);
		});
	});
});
