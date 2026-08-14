import { describe, expect, it } from "vitest";
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
});
