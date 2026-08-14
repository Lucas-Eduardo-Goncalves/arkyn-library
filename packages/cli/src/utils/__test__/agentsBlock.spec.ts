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
});
