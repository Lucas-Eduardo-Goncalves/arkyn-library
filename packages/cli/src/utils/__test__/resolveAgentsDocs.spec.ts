import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveAgentsDocs } from "../resolveAgentsDocs";

describe("resolveAgentsDocs", () => {
	it("should resolve docs only for packages whose AGENTS.md exists", () => {
		const cwd = "/project";
		const existingPaths = new Set([
			join(cwd, "node_modules", "@arkyn", "components", "AGENTS.md"),
		]);

		const docs = resolveAgentsDocs(
			cwd,
			["@arkyn/components", "@arkyn/server"],
			(path) => existingPaths.has(path),
		);

		expect(docs).toEqual([
			{
				name: "@arkyn/components",
				relativePath: "node_modules/@arkyn/components/AGENTS.md",
			},
		]);
	});

	it("should return an empty array when no AGENTS.md exists", () => {
		const docs = resolveAgentsDocs(
			"/project",
			["@arkyn/components"],
			() => false,
		);

		expect(docs).toEqual([]);
	});

	it("should return an empty array when given no package names", () => {
		const docs = resolveAgentsDocs("/project", [], () => true);

		expect(docs).toEqual([]);
	});
});
