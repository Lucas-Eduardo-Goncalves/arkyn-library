import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { isValidPackageName, resolveAgentsDocs } from "../resolveAgentsDocs";

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

	it("should skip a package name with path traversal segments instead of resolving it", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

		const docs = resolveAgentsDocs(
			"/project",
			["../../../../etc/passwd"],
			() => true,
		);

		expect(docs).toEqual([]);
		expect(warnSpy).toHaveBeenCalled();

		warnSpy.mockRestore();
	});

	it("should skip a package name that is an absolute path", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

		const docs = resolveAgentsDocs("/project", ["/etc/passwd"], () => true);

		expect(docs).toEqual([]);
		expect(warnSpy).toHaveBeenCalled();

		warnSpy.mockRestore();
	});

	it("should skip a scoped package name that smuggles traversal in the name segment", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

		const docs = resolveAgentsDocs(
			"/project",
			["@arkyn/../../../../etc/passwd"],
			() => true,
		);

		expect(docs).toEqual([]);
		expect(warnSpy).toHaveBeenCalled();

		warnSpy.mockRestore();
	});

	it("should still resolve legitimate scoped packages alongside a rejected one", () => {
		const cwd = "/project";
		const existingPaths = new Set([
			join(cwd, "node_modules", "@arkyn", "components", "AGENTS.md"),
		]);
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

		const docs = resolveAgentsDocs(
			cwd,
			["@arkyn/components", "../../etc/passwd"],
			(path) => existingPaths.has(path),
		);

		expect(docs).toEqual([
			{
				name: "@arkyn/components",
				relativePath: "node_modules/@arkyn/components/AGENTS.md",
			},
		]);

		warnSpy.mockRestore();
	});
});

describe("isValidPackageName", () => {
	it("should accept a valid unscoped package name", () => {
		expect(isValidPackageName("lodash")).toBe(true);
	});

	it("should accept a valid scoped package name", () => {
		expect(isValidPackageName("@arkyn/components")).toBe(true);
		expect(isValidPackageName("@arkyn/shared")).toBe(true);
	});

	it("should reject names containing path traversal sequences", () => {
		expect(isValidPackageName("../../../etc/passwd")).toBe(false);
		expect(isValidPackageName("@arkyn/../../../etc/passwd")).toBe(false);
	});

	it("should reject absolute paths", () => {
		expect(isValidPackageName("/etc/passwd")).toBe(false);
	});

	it("should reject names with unexpected/shell-metacharacters", () => {
		expect(isValidPackageName("foo;rm -rf /")).toBe(false);
		expect(isValidPackageName("$(whoami)")).toBe(false);
		expect(isValidPackageName("foo\0bar")).toBe(false);
	});

	it("should reject malformed or empty input", () => {
		expect(isValidPackageName("")).toBe(false);
		expect(isValidPackageName("@arkyn/")).toBe(false);
		expect(isValidPackageName("@arkyn")).toBe(false);
		expect(isValidPackageName("@scope/name/extra")).toBe(false);
	});
});
