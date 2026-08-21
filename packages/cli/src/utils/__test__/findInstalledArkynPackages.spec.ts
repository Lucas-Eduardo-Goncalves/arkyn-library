import { describe, expect, it, vi } from "vitest";
import { findInstalledArkynPackages } from "../findInstalledArkynPackages";

describe("findInstalledArkynPackages", () => {
	it("should collect @arkyn/* names from dependencies", () => {
		const pkg = {
			dependencies: { "@arkyn/components": "^3.0.0", react: "^19.0.0" },
		};

		expect(findInstalledArkynPackages(pkg)).toEqual(["@arkyn/components"]);
	});

	it("should collect @arkyn/* names from devDependencies", () => {
		const pkg = {
			devDependencies: { "@arkyn/server": "^3.0.0", typescript: "^5.0.0" },
		};

		expect(findInstalledArkynPackages(pkg)).toEqual(["@arkyn/server"]);
	});

	it("should merge and dedupe names from both fields", () => {
		const pkg = {
			dependencies: { "@arkyn/components": "^3.0.0" },
			devDependencies: {
				"@arkyn/components": "^3.0.0",
				"@arkyn/shared": "^3.0.0",
			},
		};

		expect(findInstalledArkynPackages(pkg)).toEqual([
			"@arkyn/components",
			"@arkyn/shared",
		]);
	});

	it("should return results sorted alphabetically", () => {
		const pkg = {
			dependencies: {
				"@arkyn/templates": "^3.0.0",
				"@arkyn/components": "^3.0.0",
			},
		};

		expect(findInstalledArkynPackages(pkg)).toEqual([
			"@arkyn/components",
			"@arkyn/templates",
		]);
	});

	it("should ignore packages outside the @arkyn scope", () => {
		const pkg = {
			dependencies: { "@other/scope": "^1.0.0", zod: "^4.0.0" },
		};

		expect(findInstalledArkynPackages(pkg)).toEqual([]);
	});

	it("should exclude @arkyn/cli itself", () => {
		const pkg = {
			devDependencies: { "@arkyn/cli": "^3.0.0", "@arkyn/shared": "^3.0.0" },
		};

		expect(findInstalledArkynPackages(pkg)).toEqual(["@arkyn/shared"]);
	});

	it("should return an empty array when no dependency fields exist", () => {
		expect(findInstalledArkynPackages({})).toEqual([]);
	});

	it("should keep a valid scoped @arkyn package name", () => {
		const pkg = {
			dependencies: { "@arkyn/components": "^3.0.0" },
		};

		expect(findInstalledArkynPackages(pkg)).toEqual(["@arkyn/components"]);
	});

	it("should reject a name containing path traversal segments", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const pkg = {
			dependencies: { "@arkyn/../../../../etc/passwd": "^1.0.0" },
		};

		expect(findInstalledArkynPackages(pkg)).toEqual([]);
		expect(warnSpy).toHaveBeenCalled();

		warnSpy.mockRestore();
	});

	it("should reject a name that is an absolute path", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		// Cannot start with "@arkyn/" and also start with "/", so this is
		// crafted to still hit the @arkyn prefix check before failing validation.
		const pkg = {
			dependencies: { "@arkyn//etc/passwd": "^1.0.0" },
		};

		expect(findInstalledArkynPackages(pkg)).toEqual([]);
		expect(warnSpy).toHaveBeenCalled();

		warnSpy.mockRestore();
	});

	it("should reject names with shell metacharacters or unexpected characters", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const pkg = {
			dependencies: {
				"@arkyn/foo;rm -rf": "^1.0.0",
				"@arkyn/$(whoami)": "^1.0.0",
				"@arkyn/foo\0bar": "^1.0.0",
			},
		};

		expect(findInstalledArkynPackages(pkg)).toEqual([]);
		expect(warnSpy).toHaveBeenCalledTimes(3);

		warnSpy.mockRestore();
	});

	it("should reject an empty or malformed package name", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const pkg = {
			dependencies: {
				"@arkyn/": "^1.0.0",
				"@arkyn": "^1.0.0",
			},
		};

		expect(findInstalledArkynPackages(pkg)).toEqual([]);

		warnSpy.mockRestore();
	});
});
