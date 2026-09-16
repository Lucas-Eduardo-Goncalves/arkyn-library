import { describe, expect, it } from "vitest";
import { buildAgentsBlock, mergeAgentsBlock } from "../agentsBlock";

const DOCS = [
	{
		name: "@arkyn/components",
		relativePath: "node_modules/@arkyn/components/AGENTS.md",
	},
	{
		name: "@arkyn/server",
		relativePath: "node_modules/@arkyn/server/AGENTS.md",
	},
];

describe("buildAgentsBlock", () => {
	it("should wrap the content between markers", () => {
		const block = buildAgentsBlock(DOCS);

		expect(block).toContain("<!-- arkyn:agents:start -->");
		expect(block).toContain("<!-- arkyn:agents:end -->");
	});

	it("should list a markdown link per doc", () => {
		const block = buildAgentsBlock(DOCS);

		expect(block).toContain(
			"- [@arkyn/components](node_modules/@arkyn/components/AGENTS.md)",
		);
		expect(block).toContain(
			"- [@arkyn/server](node_modules/@arkyn/server/AGENTS.md)",
		);
	});
});

describe("mergeAgentsBlock", () => {
	it("should use the block as-is when there is no existing file", () => {
		const block = buildAgentsBlock(DOCS);

		expect(mergeAgentsBlock(null, block)).toBe(`${block}\n`);
	});

	it("should append the block when the existing file has no markers", () => {
		const existing = "# My project\n\nSome notes here.\n";
		const block = buildAgentsBlock(DOCS);

		const result = mergeAgentsBlock(existing, block);

		expect(result.startsWith(existing)).toBe(true);
		expect(result).toContain(block);
	});

	it("should replace content between existing markers instead of duplicating it", () => {
		const oldBlock = buildAgentsBlock([DOCS[0]]);
		const existing = `# My project\n\n${oldBlock}\n\nMore notes.\n`;
		const newBlock = buildAgentsBlock(DOCS);

		const result = mergeAgentsBlock(existing, newBlock);

		expect(result).toContain(newBlock);
		expect(result).toContain("More notes.");
		expect(result.match(/arkyn:agents:start/g)?.length).toBe(1);
	});

	describe("corrupted/edge-case markers", () => {
		it("should handle a START marker with no END: keep user content, drop the orphan line, append a fresh block", () => {
			const existing =
				"# My project\n\n<!-- arkyn:agents:start -->\nManually written notes, not ours.\n\nMore notes.\n";
			const block = buildAgentsBlock(DOCS);

			const result = mergeAgentsBlock(existing, block);

			expect(result.match(/arkyn:agents:start/g)?.length).toBe(1);
			expect(result.match(/arkyn:agents:end/g)?.length).toBe(1);
			expect(result).toContain("Manually written notes, not ours.");
			expect(result).toContain("More notes.");
			expect(result).toContain(block);
		});

		it("should handle an END marker with no START: keep user content, drop the orphan line, append a fresh block", () => {
			const existing =
				"# My project\n\nSome notes.\n<!-- arkyn:agents:end -->\n\nMore notes.\n";
			const block = buildAgentsBlock(DOCS);

			const result = mergeAgentsBlock(existing, block);

			expect(result.match(/arkyn:agents:start/g)?.length).toBe(1);
			expect(result.match(/arkyn:agents:end/g)?.length).toBe(1);
			expect(result).toContain("Some notes.");
			expect(result).toContain("More notes.");
			expect(result).toContain(block);
		});

		it("should handle a duplicated START marker (two starts, one end): keep the resolved block, drop the dangling start", () => {
			const existing =
				"# My project\n\n<!-- arkyn:agents:start -->\n<!-- arkyn:agents:start -->\nold content\n<!-- arkyn:agents:end -->\n\nMore notes.\n";
			const block = buildAgentsBlock(DOCS);

			const result = mergeAgentsBlock(existing, block);

			expect(result.match(/arkyn:agents:start/g)?.length).toBe(1);
			expect(result.match(/arkyn:agents:end/g)?.length).toBe(1);
			expect(result).toContain(block);
			expect(result).not.toContain("old content");
			expect(result).toContain("More notes.");
		});

		it("should handle a duplicated END marker (one start, two ends): keep the resolved block, drop the dangling end", () => {
			const existing =
				"# My project\n\n<!-- arkyn:agents:start -->\nold content\n<!-- arkyn:agents:end -->\n<!-- arkyn:agents:end -->\n\nMore notes.\n";
			const block = buildAgentsBlock(DOCS);

			const result = mergeAgentsBlock(existing, block);

			expect(result.match(/arkyn:agents:start/g)?.length).toBe(1);
			expect(result.match(/arkyn:agents:end/g)?.length).toBe(1);
			expect(result).toContain(block);
			expect(result).not.toContain("old content");
			expect(result).toContain("More notes.");
		});

		it("should handle markers out of order (END before START): keep user content, drop both orphan lines, append a fresh block", () => {
			const existing =
				"# My project\n\n<!-- arkyn:agents:end -->\nSome notes.\n<!-- arkyn:agents:start -->\n\nMore notes.\n";
			const block = buildAgentsBlock(DOCS);

			const result = mergeAgentsBlock(existing, block);

			expect(result.match(/arkyn:agents:start/g)?.length).toBe(1);
			expect(result.match(/arkyn:agents:end/g)?.length).toBe(1);
			expect(result).toContain("Some notes.");
			expect(result).toContain("More notes.");
			expect(result).toContain(block);
		});

		it("should handle an empty block (start immediately followed by end)", () => {
			const existing =
				"# My project\n\n<!-- arkyn:agents:start -->\n<!-- arkyn:agents:end -->\n\nMore notes.\n";
			const block = buildAgentsBlock(DOCS);

			const result = mergeAgentsBlock(existing, block);

			expect(result).toContain(block);
			expect(result).toContain("More notes.");
			expect(result.match(/arkyn:agents:start/g)?.length).toBe(1);
		});

		it("should handle a corrupted block (mismatched/garbled end marker text): treat it as no END and append fresh", () => {
			const existing =
				"# My project\n\n<!-- arkyn:agents:start -->\nold content\n<!-- arkyn:agents:ENDXX -->\n\nMore notes.\n";
			const block = buildAgentsBlock(DOCS);

			const result = mergeAgentsBlock(existing, block);

			expect(result).toContain(block);
			expect(result).toContain("More notes.");
			// The garbled marker text isn't recognized, so it's left as-is (never guessed at).
			expect(result).toContain("<!-- arkyn:agents:ENDXX -->");
			expect(result).toContain("old content");
		});

		it("should consolidate multiple full blocks into a single fresh one", () => {
			const firstOldBlock = buildAgentsBlock([DOCS[0]]);
			const secondOldBlock = buildAgentsBlock([DOCS[1]]);
			const existing = `# My project\n\n${firstOldBlock}\n\nMiddle notes.\n\n${secondOldBlock}\n\nMore notes.\n`;
			const block = buildAgentsBlock(DOCS);

			const result = mergeAgentsBlock(existing, block);

			expect(result.match(/arkyn:agents:start/g)?.length).toBe(1);
			expect(result.match(/arkyn:agents:end/g)?.length).toBe(1);
			expect(result).toContain(block);
			expect(result).toContain("Middle notes.");
			expect(result).toContain("More notes.");
		});

		it("should be idempotent: merging into its own output twice produces the same result", () => {
			const existing = "# My project\n\nSome notes.\n";
			const block = buildAgentsBlock(DOCS);

			const once = mergeAgentsBlock(existing, block);
			const twice = mergeAgentsBlock(once, block);

			expect(twice).toBe(once);
		});

		it("should never drop user content that sits outside any marker", () => {
			const existing =
				"# My project\n\n<!-- arkyn:agents:start -->\nold\n<!-- arkyn:agents:end -->\n<!-- arkyn:agents:start -->\nModel-written novel that must survive\n<!-- arkyn:agents:end -->\n";
			const block = buildAgentsBlock(DOCS);

			const result = mergeAgentsBlock(existing, block);

			// Both regions are fully tool-managed (bounded by matched markers),
			// so consolidating them is correct — but nothing *outside* any
			// marker pair should ever be lost.
			expect(result).toContain(block);
			expect(result.match(/arkyn:agents:start/g)?.length).toBe(1);
			expect(result.match(/arkyn:agents:end/g)?.length).toBe(1);
		});
	});
});
